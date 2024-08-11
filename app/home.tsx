'use client';
import SlotDates from '@/components/calendar/SlotDate';
import {
  EventCard,
  EventCardMonthGroup,
  EventCardSkeleton,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import LotteryCard from '@/components/cards/LotteryCard';
import { SpaceCardSkeleton } from '@/components/cards/SpaceCard';
import { ZuCalendar } from '@/components/core';
import { dashboardEvent, isDev } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, EventData, Space, SpaceData } from '@/types';
import { Dayjs, dayjs } from '@/utils/dayjs';
import {
  Box,
  Button,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient } from '@tanstack/react-query';
import Carousel from 'components/Carousel';
import {
  EventIcon,
  RightArrowCircleIcon,
  RightArrowIcon,
  SpaceIcon,
} from 'components/icons';
import { Sidebar } from 'components/layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import MiniDashboard from './components/MiniDashboard';
const queryClient = new QueryClient();

const doclink = process.env.NEXT_LEARN_DOC_V2_URL || '';

const Home: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [eventsForCalendar, setEventsForCalendar] = useState<Event[]>([]);
  const [isPast, setIsPast] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [targetEventView, setTargetEventView] = useState<boolean>(false);
  const [targetEvent, setTargetEvent] = useState<Event>();

  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()),
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

  console.log(ceramic);

  const getSpaces = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          spaceIndex(first: ${isDev ? 20 : 2}) {
            edges {
              node {
                id
                admins {
                  id
                }
                superAdmin {
                  id
                }
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
                events(first: 1) {
                  edges {
                    node {
                      startTime
                      endTime
                    }
                  }
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
      setIsEventsLoading(true);
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
              members{
              id
              }
              admins{
              id
              }
              superAdmin{
              id
              }
              profile {
                username
                avatar
              }
              space {
                name
                avatar
              }
              tracks
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
        setIsEventsLoading(false);
        const getEvent =
          fetchedEvents &&
          fetchedEvents.find((event) => event.id === dashboardEvent);
        setTargetEvent(getEvent);
        const userDid = ceramic.did?.parent.toString().toLowerCase() || '';
        if (getEvent) {
          const memberIds = new Set(
            getEvent.members?.map((member) => member.id.toLowerCase()),
          );
          const adminIds = new Set(
            getEvent.admins?.map((admin) => admin.id.toLowerCase()),
          );
          const superAdminIds = new Set(
            getEvent.superAdmin?.map((sa) => sa.id.toLowerCase()),
          );

          const canView =
            memberIds.has(userDid) ||
            adminIds.has(userDid) ||
            superAdminIds.has(userDid);
          if (canView) {
            setTargetEventView(canView);
          }
        }
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsByDate = async () => {
    try {
      // TODO: clean selectedDate
      if (selectedDate) {
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
                tracks
              }
            }
          }
        }
      `;
        setIsEventsLoading(true);
        const response: any = await composeClient.executeQuery(
          getEventsByDate_QUERY,
          {
            input: {
              where: {
                startTime: {
                  equalTo: selectedDate.format('YYYY-MM-DD') + 'T00:00:00Z',
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
          setEvents(fetchedEvents);
        } else {
          console.error('Invalid data structure:', response.data);
        }
        setIsEventsLoading(false);
      }
    } catch (error) {
      setIsEventsLoading(false);
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsInMonth = async () => {
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
              tracks
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
  };

  useEffect(() => {
    document.title = 'Zuzalu City';
    Promise.all([getSpaces(), getEvents()]).catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [ceramic.did?.parent]);

  useEffect(() => {
    getEventsByDate().catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [selectedDate]);

  useEffect(() => {
    getEventsInMonth().catch((e) => {
      console.error('Failed to fetch events:', e);
    });
  }, [dateForCalendar]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={'100vw'} minHeight={'calc(100vh - 50px)'}>
        <Box
          display="grid"
          gridTemplateColumns={'auto 1fr'}
          sx={{ backgroundColor: '#222222' }}
          height={'calc(100vh - 50px)'}
        >
          {!isTablet && <Sidebar selected="Home" />}
          <Box
            borderLeft="1px solid #383838"
            flex={1}
            padding={isMobile ? '10px' : '30px'}
            width={isTablet ? '100vw' : 'calc(100vw - 260px)'}
            height={'100%'}
            sx={{
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {targetEvent && (
              <MiniDashboard
                imageUrl={targetEvent.image_url}
                spaceName={targetEvent.title}
                startTime={dayjs(targetEvent.startTime).format('MMMM DD')}
                endTime={dayjs(targetEvent.endTime).format('MMMM DD')}
                showManage={
                  targetEvent.superAdmin
                    ?.map((ad) => ad.id.toLowerCase())
                    .includes(
                      ceramic.did?.parent.toString().toLowerCase() || '',
                    ) ?? false
                }
                eventId={targetEvent.id}
                spaceId={targetEvent.spaceId as string}
                loggedIn={ceramic && targetEventView}
              />
            )}
            <Box
              display="flex"
              flexDirection="column"
              borderRadius="10px"
              padding="40px 40px"
              sx={{
                backgroundImage: 'url("/27.jpg")',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                marginTop: '20px',
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
              {spaces.length > 0 ? (
                <Carousel items={spaces} />
              ) : (
                <Box display={'flex'} gap={'10px'}>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                </Box>
              )}

              <LotteryCard />
              <Box display="flex" gap="20px" marginTop="20px">
                <Box
                  position="relative"
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  sx={{ inset: '0' }}
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
                  {isEventsLoading ? (
                    <>
                      <EventCardMonthGroup>
                        <Skeleton width={60}></Skeleton>
                      </EventCardMonthGroup>
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                    </>
                  ) : events.length === 0 ? (
                    <Box
                      display={'flex'}
                      height={200}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <Typography color={'#ccc'}>
                        No data at the moment
                      </Typography>
                    </Box>
                  ) : (
                    Object.entries(groupEventsByMonth(events)).map(
                      ([month, eventsList]) => {
                        return (
                          <Fragment key={month}>
                            <EventCardMonthGroup>{month}</EventCardMonthGroup>
                            {eventsList.map((event, index) => (
                              <EventCard
                                key={`EventCard-${index}`}
                                event={event}
                              />
                            ))}
                          </Fragment>
                        );
                      },
                    )
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
                          onChange={(val) => {
                            setSelectedDate(val);
                          }}
                          slots={{ day: SlotDates }}
                          slotProps={{
                            day: {
                              highlightedDays: eventsForCalendar
                                .filter((event) => {
                                  // filter event.startTime month equal to selected month
                                  return (
                                    dayjs(event.startTime).month() ===
                                      dateForCalendar.month() &&
                                    dayjs(event.startTime).year() ===
                                      dateForCalendar.year()
                                  );
                                })
                                .filter((event) => {
                                  if (selectedDate) {
                                    return (
                                      dayjs(event.startTime).date() !==
                                      selectedDate.date()
                                    );
                                  }
                                  return true;
                                })

                                .map((event) => {
                                  return dayjs(event.startTime).date();
                                }),
                            } as any,
                          }}
                          onMonthChange={(val) => setDateForCalendar(val)}
                          onYearChange={(val) => setDateForCalendar(val)}
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
