'use client';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VenueLocationSessionCard from 'components/cards/VenueLocationSessionCard';
import { ZuButton } from 'components/core';
import { InformationIcon, PlusCircleIcon } from 'components/icons';
import NoteIcon from 'components/icons/NoteIcon';
import { MOCK_DATA } from 'mock';
import { EmtpySessions } from './components/EmtpySessions';
import { VenueOptionButton } from './components/VenueOptionButton';
import { PostAnnouncementModal } from 'components/modals/postAnnouncementModal/PostAnnouncementModal';
import { useState } from 'react';

export default function VenueEditPage() {
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();

  const optionButtons = [
    {
      icon: <PlusCircleIcon size={7.5} />,
      content: 'Add a Space',
      description: 'a unit, room or location at the venue',
      onClick: () => {},
    },
    {
      icon: <NoteIcon />,
      content: 'Post Announcement',
      description: 'Post an update',
      onClick: () => setShowModal(true),
    },
  ];

  return (
    <Stack
      sx={{
        width: 'calc(100vw - 260px)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '30px',
        paddingBottom: '60px',
        [theme.breakpoints.down('md')]: {
          width: '100vw',
        },
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '60%',
          [theme.breakpoints.down('xl')]: {
            width: '70%',
          },
          [theme.breakpoints.down('lg')]: {
            width: '90%',
          },
          [theme.breakpoints.down('md')]: {
            padding: '10px',
            width: '98%',
          },
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          }}
        >
          <Typography fontSize={'24px'} fontWeight={700}>
            Venue Locations
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Typography fontSize={'14px'}>{"Today's Date:"}</Typography>
            <Typography
              fontSize={'14px'}
              color={'rgb(153, 153, 153)'}
              fontWeight={500}
            >
              {'Monday, May 6, 2024'}
            </Typography>
          </Box>
        </Stack>
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, .1)',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
            },
          }}
        >
          {optionButtons.map((button, index) => {
            return (
              <VenueOptionButton
                key={index}
                {...button}
                onClick={button.onClick}
              />
            );
          })}
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                <Typography
                  fontSize={'18px'}
                  fontWeight={700}
                  lineHeight={'120%'}
                >
                  Locations
                </Typography>
                <Box
                  sx={{
                    opacity: '0.5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InformationIcon size={5} />
                </Box>
              </Stack>
              <ZuButton
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '120%',
                  backgroundColor: 'rgb(46, 46, 46)',
                }}
              >
                Add a Location
              </ZuButton>
            </Stack>
            <Stack
              sx={{
                opacity: '0.8',
              }}
            >
              <Typography fontSize={'13px'} lineHeight={'120%'}>
                These are bookable areas at or near a venue for sessions
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingBottom: '20px',
            }}
          >
            {MOCK_DATA.venueSessions.length > 0 ? (
              MOCK_DATA.venueSessions.map((session: any, index) => (
                <VenueLocationSessionCard {...session} key={index} />
              ))
            ) : (
              <EmtpySessions />
            )}
          </Box>
        </Stack>
      </Stack>
      <PostAnnouncementModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </Stack>
  );
}
