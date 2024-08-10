import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Stack,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  EditIcon,
  MapIcon,
  SessionIcon,
  UserCircleIcon,
} from 'components/icons';
import { Session } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import CancelIcon from '@mui/icons-material/Cancel';
interface SessionCardProps {
  session: Session;
  eventId: string;
  spaceId?: string;
  userDID?: string;
  isLive?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  eventId,
  spaceId,
  userDID,
  isLive,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const [isRSVP, setIsRSVP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rsvpNb, setRsvpNb] = useState<number>();
  const router = useRouter();
  const handleClick = async () => {
    if (spaceId) {
      router.push(
        `/spaces/${spaceId}/events/${eventId}/sessions/${session.uuid}`,
      );
    } else {
      router.push(`/events/${eventId}/sessions/${session.uuid}`);
    }
  };
  const getRSVPNB = async (sessionID: number) => {
    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      throw sessionFetchError;
    }
    setRsvpNb(sessionData.rsvpNb ?? 0);
  };
  const getRSVPSessionByID = async (sessionID: number, userDID: string) => {
    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .match({ sessionID, userDID });
    if (error) {
      console.log('Failed to get RSVP session by ID: ', error);
      return;
    }
    if (data.length > 0) {
      setIsRSVP(true);
      return;
    }
    setIsRSVP(false);
  };

  const setRSVPSession = async (sessionID: number, userDID: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('rsvp')
      .insert({ sessionID, userDID });
    if (error) {
      console.log('Failed to set as RSVP: ', error);
      setIsLoading(false);
      return;
    }
    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      throw sessionFetchError;
    }

    const currentRsvpNb = sessionData.rsvpNb || 0;

    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({ rsvpNb: currentRsvpNb + 1 })
      .eq('id', sessionID);

    if (sessionUpdateError) {
      throw sessionUpdateError;
    }
    setRsvpNb(currentRsvpNb + 1);

    setIsLoading(false);
    setIsRSVP(true);
  };

  const removeRSVPSession = async (sessionID: number, userDID: string) => {
    setIsLoading(true);

    const { error: deleteError } = await supabase
      .from('rsvp')
      .delete()
      .match({ sessionID, userDID });

    if (deleteError) {
      console.log('Failed to cancel RSVP:', deleteError);
      setIsLoading(false);
      return;
    }

    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      console.log('Failed to fetch session data:', sessionFetchError);
      setIsLoading(false);
      return;
    }

    const currentRsvpNb = sessionData.rsvpNb || 0;

    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({ rsvpNb: Math.max(0, currentRsvpNb - 1) })
      .eq('id', sessionID);

    if (sessionUpdateError) {
      console.log('Failed to update RSVP number:', sessionUpdateError);
      setIsLoading(false);
      return;
    }
    setRsvpNb(Math.max(0, currentRsvpNb - 1));

    setIsLoading(false);
    setIsRSVP(false);
  };

  const handleRSVPTicketTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (userDID) {
      setRSVPSession(Number(session.id), userDID);
    }
  };

  const handleCancelTicketTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    removeRSVPSession(Number(session.id), userDID as string);
  };

  const handleTicketClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRSVP) {
      removeRSVPSession(Number(session.id), userDID as string);
    } else {
      if (userDID) {
        setRSVPSession(Number(session.id), userDID);
      }
    }
  };

  useEffect(() => {
    if (userDID) {
      getRSVPSessionByID(Number(session.id), userDID);
      getRSVPNB(Number(session.id));
    }
  }, [session, userDID]);

  return (
    <Stack
      onClick={() => handleClick()}
      direction="row"
      padding="10px 10px 20px 10px"
      borderRadius={'10px'}
      sx={{
        ':hover': {
          backgroundColor: '#383838',
        },
        cursor: 'pointer',
      }}
    >
      <Stack spacing="10px" flex={1}>
        <Stack direction="row" spacing="10px" alignItems="center">
          {isLive && (
            <Typography
              bgcolor="#7DFFD11A"
              padding="2px 4px"
              color="#7DFFD1"
              variant="bodyX"
              borderRadius="2px"
            >
              · LIVE
            </Typography>
          )}
          <Typography variant="caption" textTransform="uppercase">
            {session.track}
          </Typography>
        </Stack>
        <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
          {dayjs(session.startTime).tz(session.timezone).format('h:mm A')} -{' '}
          {dayjs(session.endTime).tz(session.timezone).format('h:mm A')}
        </Typography>
        <Typography variant="subtitleSB">{session.title}</Typography>
        <Stack direction={'row'} spacing={1} alignItems="center">
          {session.speakers.length > 2 ? (
            <Typography variant="bodyS" sx={{ opacity: 0.7 }}>
              Speakers:
            </Typography>
          ) : null}
          {session.speakers
            ? JSON.parse(session.speakers).map(
                (speaker: any, index: number) => (
                  <Stack
                    key={`Speaker-${index}`}
                    direction={'row'}
                    spacing={0.5}
                    alignItems={'center'}
                  >
                    <Box
                      component={'img'}
                      height={20}
                      width={20}
                      borderRadius={10}
                      src={speaker.avatar || '/user/avatar_p.png'}
                    />
                    <Typography variant="bodyS">{speaker.username}</Typography>
                  </Stack>
                ),
              )
            : null}
        </Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={1}
          sx={{ opacity: '0.5' }}
        >
          <MapIcon size={4} />
          <Typography
            variant="caption"
            sx={{ opacity: 0.5 }}
            textTransform={'uppercase'}
          >
            {session.format === 'online' ? session.video_url : session.location}
          </Typography>
        </Stack>
      </Stack>
      <Stack gap={'10px'} alignItems={'flex-end'}>
        {userDID && session.creatorDID === userDID && (
          <Stack
            direction={'row'}
            gap={'4px'}
            padding={'2px 5px'}
            bgcolor={'rgba(255, 199, 125, 0.10)'}
            borderRadius={'2px'}
            alignItems={'center'}
          >
            <UserCircleIcon color={'#FFCC66'} size={4} />
            <Typography
              textTransform={'uppercase'}
              fontWeight={700}
              fontSize={'10px'}
              color={'#FFC77D'}
            >
              My Session
            </Typography>
          </Stack>
        )}
        <Tooltip
          title={
            !isRSVP ? (
              <Typography
                sx={{ cursor: 'pointer' }}
                fontSize={'14px'}
                onClick={handleRSVPTicketTooltip}
              >
                RSVP
              </Typography>
            ) : (
              <Typography
                sx={{ cursor: 'pointer' }}
                fontSize={'14px'}
                onClick={handleCancelTicketTooltip}
              >
                Cancel
              </Typography>
            )
          }
          sx={{ cursor: 'pointer', borderRadius: '8px' }}
        >
          <Stack
            padding="4px"
            spacing="4px"
            direction="row"
            alignItems="center"
            borderRadius="8px"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
              opacity: 0.7,
              color: isRSVP ? '#7DFFD1' : 'white',
              backgroundColor: isRSVP
                ? 'rgba(125, 255, 209, 0.10)'
                : 'rgba(255, 255, 255, 0.05)',
              width: 'fit-content',
            }}
            height="fit-content"
            onClick={handleTicketClick}
          >
            {isLoading ? (
              <CircularProgress
                size={'24px'}
                sx={{ color: '#7DFFD1' }}
              ></CircularProgress>
            ) : isRSVP ? (
              hover ? (
                <CancelIcon />
              ) : (
                <SessionIcon fill={'#7DFFD1'} />
              )
            ) : (
              <SessionIcon fill={'white'} />
            )}
            <Typography variant="bodyS">
              {rsvpNb !== undefined ? rsvpNb : 0}
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
