import { ZuButton } from '@/components/core';
import {
  ArrowTopRightSquareIcon,
  ChatsIcon,
  SettingIcon,
  TicketIcon,
} from '@/components/icons';
import ClockIcon from '@/components/icons/Clock';
import { Box, Stack, Typography, useTheme, Button } from '@mui/material';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';

interface PropTypes {
  spaceName: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  showManage: boolean;
  eventId: string;
  spaceId: string;
}

export default function MiniDashboard({
  spaceName,
  startTime,
  endTime,
  imageUrl,
  showManage,
  eventId,
  spaceId,
}: PropTypes) {
  const { breakpoints } = useTheme();
  const router = useRouter();
  const handleNavigation = (tab: string, option: string) => {
    router.push(`/events/${eventId}`);
    sessionStorage.setItem('tab', tab);
    sessionStorage.setItem('option', option);
  };
  const externalNavigation = (url: string) => {
    window.location.href = url;
  };
  const manageEventNavigation = () => {
    router.push(`/spaces/${spaceId}/adminevents/${eventId}`);
  };
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
      <Stack gap={'10px'} direction={'row'} alignItems={'center'}>
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
      </Stack>
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
    </Stack>
  );
}
