'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ZuCalendar } from '@/components/core';
import Carousel from 'components/Carousel';
import { Header, Sidebar } from 'components/layout';
import {
  RightArrowCircleIcon,
  SpaceIcon,
  RightArrowIcon,
  EventIcon,
} from 'components/icons';
import { EventCard } from '@/components/cards';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useCeramicContext } from '../context/CeramicContext';
import AuthPrompt from '@/components/AuthPrompt';
import { Event, EventData, Space, SpaceData } from '@/types';

const Home: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();

  const getSpaces = async () => {
    console.log('Fetching spaces...');
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          spaceIndex(first: 20) {
            edges {
              node {
                id
                avatar
                banner
                description
                name
                profileId
                tagline
                website
                twitter
                telegram
                nostr
                lens
                github
                discord
                ens
              }
            }
          }
        }
      `);

      if ('spaceIndex' in response.data) {
        const spaceData: SpaceData = response.data as SpaceData;
        const fetchedSpaces: Space[] = spaceData.spaceIndex.edges.map(
          (edge) => edge.node,
        );
        setSpaces(fetchedSpaces);
        console.log('Spaces fetched:', fetchedSpaces);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  const getEvents = async () => {
    console.log('Fetching events...');
    try {
      const response: any = await composeClient.executeQuery(`
      query {
        eventIndex(first: 10) {
          edges {
            node {
              id
              title
              description
              startTime
              endTime
              timezone
              status
              tagline
              image_url
              external_url
              meeting_url
              profileId
              spaceId
              participant_count
              min_participant
              max_participant
              createdAt
            }
          }
        }
      }
    `);

      if ('eventIndex' in response.data) {
        const eventData: EventData = response.data as EventData;
        const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
          (edge) => edge.node,
        );
        setEvents(fetchedEvents);
        console.log('Events fetched:', fetchedEvents);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSpaces();
        await getEvents();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <AuthPrompt />
        <Box display="grid" gridTemplateColumns={'auto 1fr'}>
          {!isTablet && <Sidebar selected="Home" />}
          <Box
            borderLeft="1px solid #383838"
            flexGrow={1}
            padding={isMobile ? '10px' : '30px'}
            overflow="hidden"
          >
            <Box
              display="flex"
              flexDirection="column"
              borderRadius="10px"
              padding="40px 40px"
              sx={{
                backgroundImage: 'url("4.webp")',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <Typography
                color={theme.palette.text.primary}
                variant={isMobile ? 'h1' : 'hB'}
              >
                Zuzalu City
              </Typography>
              <Typography color="white" variant="bodyB" marginBottom="20px">
                Welcome to the new Zuzalu City
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#383838',
                  color: 'white',
                  width: isMobile ? '100%' : '200px',
                  borderRadius: '10px',
                }}
                startIcon={<RightArrowIcon />}
              >
                Learn About v2
              </Button>
            </Box>
            <Box marginTop="30px">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap="10px">
                  <SpaceIcon />
                  <Typography
                    variant={isMobile ? 'subtitleMB' : 'subtitleLB'}
                    color="white"
                  >
                    Explore Spaces
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="10px"
                  onClick={() => router.push('/spaces')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography color="white" variant="bodyM">
                    View All Spaces
                  </Typography>
                  <RightArrowCircleIcon />
                </Box>
              </Box>
              <Box marginY="20px">
                <Typography color="white" variant="bodyM">
                  Most Active Spaces
                </Typography>
              </Box>
              <Carousel items={spaces} />
              <Box display="flex" gap="20px" marginTop="20px">
                <Box
                  position="relative"
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  overflow="auto"
                  maxHeight="95vh"
                >
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap="10px">
                      <EventIcon />
                      <Typography color="white" variant="subtitleLB">
                        Events
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="10px">
                      <Typography color="white" variant="bodyB">
                        View All Events
                      </Typography>
                      <RightArrowCircleIcon />
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      position: 'sticky',
                      top: 60,
                    }}
                    color="white"
                    border="1px solid #383838"
                    align="center"
                    paddingY="8px"
                    borderRadius="40px"
                    variant="subtitleS"
                    bgcolor="rgba(34, 34, 34, 0.8)"
                  >
                    October 2023
                  </Typography>
                  <Box>
                    {events.map((event, index) => (
                      <EventCard
                        key={`EventCard-${index}`}
                        name={event.title}
                        description={event.description}
                      />
                    ))}
                  </Box>
                </Box>
                {!isTablet && (
                  <Box
                    width="360px"
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                  >
                    <Typography
                      color="white"
                      variant="subtitleS"
                      padding="20px 10px"
                      borderBottom="1px solid #383838"
                    >
                      Sort & Filter Sessions
                    </Typography>
                    <Box
                      display="flex"
                      gap="4px"
                      padding="2px"
                      borderRadius="10px"
                      bgcolor="#2d2d2d"
                    >
                      <Button
                        sx={{
                          flex: 1,
                          backgroundColor: '#424242',
                          borderRadius: '8px',
                          color: 'white',
                          fontFamily: 'Inter',
                        }}
                      >
                        Upcoming
                      </Button>
                      <Button
                        sx={{
                          flex: 1,
                          backgroundColor: '#2d2d2d',
                          borderRadius: '8px',
                          color: 'white',
                          fontFamily: 'Inter',
                        }}
                      >
                        Past
                      </Button>
                    </Box>
                    <Box>
                      <ZuCalendar defaultValue={dayjs('2022-04-17')} />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Home;
