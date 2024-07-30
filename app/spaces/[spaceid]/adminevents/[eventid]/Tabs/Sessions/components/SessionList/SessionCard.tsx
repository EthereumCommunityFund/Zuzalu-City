import React from 'react';
import dayjs from 'dayjs';
import { Stack, Typography, Box } from '@mui/material';
import {
  EditIcon,
  MapIcon,
  SessionIcon,
  UserCircleIcon,
} from 'components/icons';
import { Session } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
interface SessionCardProps {
  session: Session;
  eventId: string;
  spaceId?: string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  eventId,
  spaceId,
}) => {
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
          <Typography
            bgcolor="#7DFFD11A"
            padding="2px 4px"
            color="#7DFFD1"
            variant="bodyX"
            borderRadius="2px"
          >
            · LIVE
          </Typography>
          <Typography variant="caption" textTransform="uppercase">
            {session.track}
          </Typography>
        </Stack>
        <Typography variant="bodyB">
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
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <MapIcon size={4} />
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            {session.format === 'online' ? session.video_url : session.location}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        padding="4px"
        spacing="4px"
        direction="row"
        alignItems="center"
        borderRadius="8px"
        sx={{ opacity: 0.7 }}
        bgcolor="rgba(255, 255, 255, 0.05)"
        height="fit-content"
      >
        <SessionIcon />
        <Typography variant="bodyS">{session.rsvpNb || 0}</Typography>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
