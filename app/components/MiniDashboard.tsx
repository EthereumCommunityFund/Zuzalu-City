import { ZuButton } from '@/components/core';
import MiniDashboardSigninButton from '@/components/home/MiniDashboardSigninButton';
import SigninDialog from '@/components/home/SigninDialog';
import {
  ArrowTopRightSquareIcon,
  ChatsIcon,
  SettingIcon,
  TicketIcon,
} from '@/components/icons';
import ClockIcon from '@/components/icons/Clock';
import NewUserPromptModal from '@/components/modals/newUserPrompt';
import { dashboardEvent } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { useZupassContext } from '@/context/ZupassContext';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface PropTypes {
  spaceName: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  showManage: boolean;
  eventId: string;
  spaceId: string;
  loggedIn: boolean;
}

interface IDiscoverButtonProps {
  eventId: string;
}

const DiscoverButton = ({ eventId }: IDiscoverButtonProps) => {
  const { breakpoints } = useTheme();
  const router = useRouter();

  const handleNavigation = (tab: string, option?: string) => {
    router.push(`/events/${eventId}`);
    sessionStorage.setItem('tab', tab);
    if (option) {
      sessionStorage.setItem('option', option);
    }
  };

  return (
    <ZuButton
      onClick={() => handleNavigation('About')}
      sx={{
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '6px 10px',
        fontSize: '14px',
        fontWeight: '700',
        gap: '10px',
        '& > span': {
          margin: '0px',
        },
        [breakpoints.down('md')]: {
          width: '100%',
          justifyContent: 'flex-start',
        },
      }}
      startIcon={<ArrowTopRightSquareIcon />}
    >
      Discover
    </ZuButton>
  );
};

export default function MiniDashboard({
  spaceName,
  startTime,
  endTime,
  imageUrl,
  showManage,
  eventId,
  spaceId,
  loggedIn,
}: PropTypes) {
  const { breakpoints } = useTheme();
  const router = useRouter();
  const { profile } = useCeramicContext();
  const { nullifierHash } = useZupassContext();

  const [openModal, setOpenModal] = useState(false);
  const [openNewUserModal, setOpenNewUserModal] = useState(false);
  const [stage, setStage] = useState('Initial');

  const handleNavigation = (tab: string, option?: string) => {
    router.push(`/events/${eventId}`);
    sessionStorage.setItem('tab', tab);
    if (option) {
      sessionStorage.setItem('option', option);
    }
  };
  const externalNavigation = (url: string) => {
    window.open(url, '_blank');
  };
  const manageEventNavigation = () => {
    router.push(`/spaces/${spaceId}/adminevents/${eventId}`);
  };

  const handleShowModal = useCallback(() => {
    setOpenModal((v) => !v);
  }, []);

  const handleShowNewUserModal = useCallback(() => {
    setOpenNewUserModal((v) => !v);
  }, []);

  useEffect(() => {
    if (nullifierHash) {
      setStage('Wallet Link');
    }
  }, [nullifierHash]);

  useEffect(() => {
    if (profile?.id && openModal) {
      setOpenModal(false);
    }
  }, [openModal, profile?.id]);

  return (
    <Stack
      width={'100%'}
      padding={'10px'}
      gap={'10px'}
      sx={{
        background:
          'linear-gradient(90deg, rgba(20, 143, 114, 0.10) 20%, rgba(0, 0, 0, 0.00) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
      }}
      borderRadius={'10px'}
    >
      <SigninDialog
        open={openModal}
        handleShowNewUserModal={handleShowNewUserModal}
        handleClose={handleShowModal}
        setStage={setStage}
        stage={stage}
      />
      <NewUserPromptModal
        showModal={openNewUserModal}
        onClose={handleShowNewUserModal}
        setVerify={() => {}}
        eventId={dashboardEvent!}
      />
      <Stack
        gap={'10px'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
          <Box
            component={'img'}
            width={'40px'}
            height={'40px'}
            src={imageUrl ? imageUrl : '/14.webp'}
            borderRadius={'4px '}
          />
          <Stack
            direction={'row'}
            gap={'10px'}
            alignItems={'center'}
            height={'100%'}
            sx={{
              [breakpoints.down('md')]: {
                flexDirection: 'column',
                gap: '5px',
                alignItems: 'flex-start',
              },
            }}
          >
            {loggedIn ? (
              <Stack direction="row" alignItems="center" gap="10px">
                <Typography
                  fontSize={'18px'}
                  fontWeight={700}
                  lineHeight={'120%'}
                  color={'white'}
                >
                  {`Welcome to ${spaceName}`}
                </Typography>
                <Typography
                  fontSize={'14px'}
                  fontWeight={500}
                  lineHeight={'120%'}
                  color={'white'}
                  sx={{ opacity: '0.8' }}
                >
                  {`${startTime} - ${endTime}`}
                </Typography>
              </Stack>
            ) : (
              <Typography
                fontSize={'18px'}
                fontWeight={700}
                lineHeight={'120%'}
                color={'white'}
                sx={{
                  [breakpoints.down('sm')]: {
                    fontSize: '12px',
                  },
                }}
              >
                Are You Attending ZuVillage?
              </Typography>
            )}
          </Stack>
        </Stack>
        {!loggedIn ? (
          profile?.id ? (
            <DiscoverButton eventId={eventId} />
          ) : (
            <MiniDashboardSigninButton handleShowModal={handleShowModal} />
          )
        ) : (
          <DiscoverButton eventId={eventId} />
        )}
      </Stack>
      {loggedIn && (
        <Stack
          direction={'row'}
          gap={'10px'}
          sx={{
            flexWrap: 'wrap',
            [breakpoints.down('md')]: {
              flexDirection: 'column',
            },
          }}
        >
          <ZuButton
            onClick={() => handleNavigation('Sessions', 'Today')}
            sx={{
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 10px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
                justifyContent: 'flex-start',
              },
            }}
            startIcon={<ClockIcon />}
          >
            {`Today's Schedule`}
          </ZuButton>

          <ZuButton
            onClick={() => handleNavigation('Sessions', 'RSVP')}
            sx={{
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 10px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
                justifyContent: 'flex-start',
              },
            }}
            startIcon={<TicketIcon />}
          >
            {'My RSVPs'}
          </ZuButton>
          <ZuButton
            onClick={() =>
              externalNavigation('https://matrix.to/#/#welcome-zg:matrix.org')
            }
            sx={{
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 10px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
                justifyContent: 'flex-start',
              },
            }}
            startIcon={<ChatsIcon />}
          >
            {'Join Conversation'}
          </ZuButton>
          <ZuButton
            onClick={() =>
              externalNavigation('https://zuvillage-georgia.framer.website/')
            }
            sx={{
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 10px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
                justifyContent: 'flex-start',
              },
            }}
            startIcon={<ArrowTopRightSquareIcon />}
          >
            {'About ZuVillage'}
          </ZuButton>
          {showManage && (
            <ZuButton
              onClick={manageEventNavigation}
              sx={{
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                backgroundColor: 'rgba(255, 199, 125, 0.10)',
                padding: '6px 10px',
                fontSize: '14px',
                fontWeight: '700',
                gap: '10px',
                '& > span': {
                  margin: '0px',
                },
                color: '#FFC77D',
                [breakpoints.down('md')]: {
                  width: '100%',
                  justifyContent: 'flex-start',
                },
              }}
              startIcon={<SettingIcon color="#FFC77D" />}
            >
              {'Manage The Event'}
            </ZuButton>
          )}
        </Stack>
      )}
    </Stack>
  );
}
