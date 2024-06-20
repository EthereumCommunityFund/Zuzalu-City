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
import dayjs, { Dayjs } from 'dayjs';
import { MOCK_DATA } from 'mock';
import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CeramicProvider } from '../context/CeramicContext';
import { useCeramicContext } from '../context/CeramicContext';
import AuthPrompt from '@/components/AuthPrompt';
import { Event, EventData, Space, SpaceData } from '@/types';
import LotteryCard from '@/components/cards/LotteryCard';
import Link from 'next/link';
import Image from 'next/image';
import {
  formatDateToMonth,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import SlotDates from '@/components/calendar/SlotDate';

const queryClient = new QueryClient();

const doclink = process.env.NEXT_LEARN_DOC_V2_URL || '';

const Home: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsForCalendar, setEventsForCalendar] = useState<Event[]>([]);
  const [isPast, setIsPast] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    ),
  );

  const [dateForCalendar, setDateForCalendar] = useState<Dayjs | null>(
    dayjs(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    ),
  );

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
                category
                members{
                  id
                }
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
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  const getEvents = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
      query {
        eventIndex(first: 20) {
          edges {
            node {
              createdAt
              description
              endTime
              external_url
              gated
              id
              image_url
              max_participant
              meeting_url
              min_participant
              participant_count
              profileId
              spaceId
              startTime
              status
              tagline
              timezone
              title
              profile {
                username
                avatar
              }
            }
          }
        }
      }
    `);

      if (response && response.data && 'eventIndex' in response.data) {
        const eventData: EventData = response.data as EventData;
        const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
          (edge) => edge.node,
        );
        setEvents(fetchedEvents);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsByDate = async () => {
    try {
      if (selectedDate) {
        let currentDate = new Date(
          selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
        );

        const timeDiff = selectedDate.utcOffset();
        if (timeDiff < 0) {
          currentDate = new Date(
            new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).getTime() -
              (24 * 60 * 60 * 1000 + timeDiff * 60 * 1000),
          );
        } else {
          currentDate = new Date(
            new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).getTime() -
              timeDiff * 60 * 1000,
          );
        }
        const utcYear = currentDate.getFullYear();
        const uctMM =
          String(currentDate.getMonth() + 1).length === 1
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1;
        const utcDD =
          String(currentDate.getDate() + 1).length === 1
            ? `0${currentDate.getDate() + 1}`
            : currentDate.getDate() + 1;
        const utcHH =
          String(currentDate.getHours()).length === 1
            ? `0${currentDate.getHours()}`
            : currentDate.getHours();
        const utcMM =
          String(currentDate.getMinutes()).length === 1
            ? `0${currentDate.getMinutes()}`
            : currentDate.getMinutes();
        const utcSS =
          String(currentDate.getSeconds()).length === 1
            ? `0${currentDate.getSeconds()}`
            : currentDate.getSeconds();
        console.log(
          'selectedDate: ',
          selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          `${utcYear}-${uctMM}-${utcDD}T${utcHH}:${utcMM}:${utcSS}Z`,
        );
        const getEventsByDate_QUERY = `
          query ($input:EventFiltersInput!) {
          eventIndex(filters:$input, first: 20){
            edges {
              node {
                createdAt
                description
                endTime
                external_url
                gated
                id
                image_url
                max_participant
                meeting_url
                min_participant
                participant_count
                profileId
                spaceId
                startTime
                status
                tagline
                timezone
                title
                profile {
                  username
                  avatar
                }
              }
            }
          }
        }
      `;
        const response: any = await composeClient.executeQuery(
          getEventsByDate_QUERY,
          {
            input: {
              where: {
                startTime: {
                  equalTo: `${utcYear}-${uctMM}-${utcDD}T${utcHH}:${utcMM}:${utcSS}Z`,
                },
              },
            },
          },
        );
        if (response && response.data && 'eventIndex' in response.data) {
          const eventData: EventData = response.data as EventData;
          const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
            (edge) => edge.node,
          );
          console.log('fetchEvents: ', fetchedEvents);
          setEvents(fetchedEvents);
        } else {
          console.error('Invalid data structure:', response.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsInMonth = async () => {
    try {
      const getEventsByDate_QUERY = `
        query ($input:EventFiltersInput!) {
        eventIndex(filters:$input, first: 20){
          edges {
            node {
              description
              external_url
              gated
              image_url
              max_participant
              meeting_url
              min_participant
              participant_count
              profileId
              spaceId
              status
              tagline
              timezone
              title
              profile {
                username
                avatar
              }
              createdAt
              endTime
              id
              startTime
            }
          }
        }
      }
    `;
      const response: any = await composeClient.executeQuery(
        getEventsByDate_QUERY,
        {
          input: {
            where: {
              startTime: {
                lessThanOrEqualTo: dateForCalendar
                  ?.endOf('month')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]'),
                greaterThanOrEqualTo: dateForCalendar
                  ?.startOf('month')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]'),
              },
            },
          },
        },
      );
      if (response && response.data && 'eventIndex' in response.data) {
        const eventData: EventData = response.data as EventData;
        const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
          (edge) => edge.node,
        );
        setEventsForCalendar(fetchedEvents);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleMonthChange = (date: Dayjs) => {
    console.log('date: ', date.endOf('month').toISOString());
    setDateForCalendar(date);
  };

  useEffect(() => {
    document.title = 'Zuzalu City';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEventsByDate();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    getEventsInMonth();
  }, [dateForCalendar]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={'100vw'} minHeight={'100vh'}>
        <Box
          display="grid"
          gridTemplateColumns={'auto 1fr'}
          sx={{ backgroundColor: '#222222' }}
          minHeight={'100vh'}
        >
          {!isTablet && <Sidebar selected="Home" />}
          <Box
            borderLeft="1px solid #383838"
            flex={1}
            padding={isMobile ? '10px' : '30px'}
            width={isTablet ? '100vw' : 'calc(100vw - 260px)'}
          >
            <Box
              display="flex"
              flexDirection="column"
              borderRadius="10px"
              padding="40px 40px"
              position="relative"
            >
              <Image
                src={'/BannerMain.png'}
                style={{ borderRadius: 10 }}
                fill={true}
                alt={""}
                objectFit={'cover'}
              />
              <Typography
                color={theme.palette.text.primary}
                variant={isMobile ? 'h1' : 'hB'}
              >
                Zuzalu City
              </Typography>
              <Typography color="white" variant="bodyB" marginBottom="20px">
                Welcome to the new Zuzalu City
              </Typography>
              <Link href={doclink}>
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
              </Link>
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
              {/* <Carousel items={spaces} /> */}
              <Carousel items={spaces} />
              <LotteryCard />
              <Box display="flex" gap="20px" marginTop="20px">
                <Box
                  position="relative"
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  sx={{
                    inset: '0',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap="10px">
                        <EventIcon />
                        <Typography color="white" variant="subtitleLB">
                          Events
                        </Typography>
                      </Box>
                      <Link
                        href={'/events'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          textDecoration: 'blink',
                        }}
                      >
                        <Box display="flex" alignItems="center" gap="10px">
                          <Typography color="white" variant="bodyB">
                            View All Events
                          </Typography>
                          <RightArrowCircleIcon />
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                  {Object.entries(groupEventsByMonth(events)).map(
                    ([month, eventsList]) => {
                      return (
                        <div key={month}>
                          <Box
                            component={'div'}
                            width={'100%'}
                            color="white"
                            border="1px solid #383838"
                            justifyContent="center"
                            alignContent={'center'}
                            paddingY="8px"
                            borderRadius="40px"
                            bgcolor="rgba(34, 34, 34, 0.8)"
                            fontWeight={700}
                            display={'flex'}
                          >
                            {month}
                          </Box>
                          <Box>
                            {eventsList.map((event, index) => (
                              <EventCard
                                id={event.id}
                                spaceId={event.spaceId}
                                key={`EventCard-${index}`}
                                event={event}
                                by={event.profile?.username}
                              />
                            ))}
                          </Box>
                        </div>
                      );
                    },
                  )}
                </Box>
                <Box>
                  {!isTablet && (
                    <Box
                      width="360px"
                      display="flex"
                      flexDirection="column"
                      gap="20px"
                      sx={{
                        position: 'sticky',
                        top: 60,
                      }}
                    >
                      <Typography
                        color="white"
                        variant="subtitleS"
                        padding="20px 10px"
                        borderBottom="1px solid #383838"
                      >
                        Sort & Filter Events
                      </Typography>
                      {/*<Box
                        display="flex"
                        gap="4px"
                        padding="2px"
                        borderRadius="10px"
                        bgcolor="#2d2d2d"
                      >
                        <Button
                          sx={{
                            flex: 1,
                            backgroundColor: isPast ? '#2d2d2d' : '#424242',
                            borderRadius: '8px',
                            color: 'white',
                            fontFamily: 'Inter',
                          }}
                          onClick={() => setIsPast(false)}
                        >
                          Upcoming
                        </Button>
                        <Button
                          sx={{
                            flex: 1,
                            backgroundColor: isPast ? '#424242' : '#2d2d2d',
                            borderRadius: '8px',
                            color: 'white',
                            fontFamily: 'Inter',
                          }}
                          onClick={() => setIsPast(true)}
                        >
                          Past
                        </Button>
                      </Box>
                      */}
                      <Box>
                        <ZuCalendar
                          value={selectedDate}
                          onChange={(val) => {
                            console.log('val: ', val);
                            setSelectedDate(val);
                          }}
                          slots={{
                            day: SlotDates,
                          }}
                          slotProps={{
                            day: {
                              highlightedDays: eventsForCalendar.map(
                                (event) => {
                                  return new Date(event.startTime).getDate();
                                },
                              ),
                            } as any,
                          }}
                          onMonthChange={(val) => handleMonthChange(val)}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Home;
