'use client';
import SessionCard from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Sessions/components/SessionList/SessionCard';
import SlotDates from '@/components/calendar/SlotDate';
import { ZuButton, ZuCalendar, ZuSwitch } from '@/components/core';
import { EditorPreview } from '@/components/editor/EditorPreview';
import {
  CalendarIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  LeftArrowIcon,
  MapIcon,
  MicrophoneIcon,
  PlusCircleIcon,
  PlusIcon,
  SearchIcon,
  SessionIcon,
  TagIcon,
  UserPlusIcon,
} from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Anchor, Event, Profile, ProfileEdge, Session, Venue } from '@/types';
import dayjs, { Dayjs } from '@/utils/dayjs';
import formatDateAgo from '@/utils/formatDateAgo';
import { supabase } from '@/utils/supabase/client';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import {
  Box,
  Divider,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Popover,
  Skeleton,
  Stack,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FilterSessionPop } from './FilterSessionPop';
import { Drawer } from '@/app/events/[eventid]/tabs/Session/components/Drawer';

interface ISessions {
  eventData: Event | undefined;
  option?: string;
}

const Sessions: React.FC<ISessions> = ({ eventData, option }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { ceramic, composeClient } = useCeramicContext();
  const params = useParams();
  const eventId = params.eventid.toString();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [showFilterSessionPop, setShowFilterSessionPop] =
    useState<boolean>(false);
  const [isRSVPFiltered, setIsRSVPFiltered] = useState(false);
  const [isManagedFiltered, setIsManagedFiltered] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session>();
  const [isRsvped, setIsRsvped] = useState<boolean>(false);
  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectDateRange, setSelectDateRange] = useState<Dayjs[] | null>(null);
  const [sessionsByDate, setSessionsByDate] =
    useState<Record<string, Session[]>>();
  const [bookedSessionsForDay, setBookedSessionsForDay] = useState<Session[]>(
    [],
  );

  const [venues, setVenues] = useState<Venue[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const adminId = ceramic?.did?.parent || '';
  const [sessionLocation, setSessionLocation] = useState<string>('');
  const [refreshFlag, setRefreshFlag] = useState(0);
  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [trackAnchor, setTrackAnchor] = useState<HTMLDivElement | null>(null);
  const [locationAnchor, setLocationAnchor] = useState<HTMLDivElement | null>(
    null,
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const handleCalendarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const resetDateFilter = () => {
    setSelectDateRange(null);
    setSelectedDate(null);
    setDateForCalendar(dayjs(new Date()));
  };

  const trackAnchorOpen = Boolean(trackAnchor);
  const locationAnchorOpen = Boolean(locationAnchor);
  const trackAnchorId = trackAnchorOpen ? 'track-filter-popup' : undefined;
  const locationAnchorId = locationAnchorOpen
    ? 'location-filter-popup'
    : undefined;

  const handleTrackFilterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setTrackAnchor(event.currentTarget);
  };

  const handleTrackFilterClose = () => {
    setTrackAnchor(null);
  };

  const handleLocationFilterClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setLocationAnchor(event.currentTarget);
  };

  const handleLocationFilterClose = () => {
    setLocationAnchor(null);
  };

  const calendarOpen = Boolean(anchorEl);

  const router = useRouter();
  useEffect(() => {
    let dates = sessionsByDate
      ? Object.keys(sessionsByDate)
          .map((item) =>
            dayjs(item, 'MMMM D, YYYY').tz(eventData?.timezone, true).valueOf(),
          )
          .sort((a, b) => a - b)
      : [];

    const tmpToday = dayjs(dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
      .tz(eventData?.timezone, true)
      .valueOf();
    if (dates.some((date) => date >= tmpToday)) {
      dates = dates.filter((date) => date >= tmpToday);
    }
    const getDay = () => {
      let nearToday;
      let tmpTime = 1000000000000;
      dates.forEach((item) => {
        const time = Math.abs(item - tmpToday);
        if (time < tmpTime) {
          tmpTime = time;
          nearToday = item;
        }
      });
      return dayjs(nearToday)
        .tz(eventData?.timezone, true)
        .format('MMMM-D-YYYY');
    };
    const nearToday = getDay();
    if (sessionsByDate && nearToday) {
      const dom = document.getElementById(nearToday);
      console.log(dom, 'dom', nearToday, 'nearToday');

      if (dom) {
        window.scrollTo({
          behavior: 'instant',
          top: dom.offsetTop + 120,
        });
      }
    }
  }, [sessionsByDate]);

  const handleDownload = (date: string) => () => {
    if (!sessionsByDate) return;
    const data = sessionsByDate[date];
    let txt = `${date}\n\n`;
    data.forEach((session: Session) => {
      txt += `${dayjs(session.startTime).tz(eventData?.timezone).format('h:mm A')}-${dayjs(session.endTime).tz(eventData?.timezone).format('h:mm A')} · ${session.location}\n## ${session.title}\n\n`;
    });

    const eleLink = document.createElement('a');
    eleLink.download = `${date}.text`;
    eleLink.style.display = 'none';
    const blob = new Blob([txt]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };

  const groupSessionByDate = (
    sessions: Session[] | undefined,
  ): Record<string, Session[]> => {
    if (!sessions || sessions.length === 0) {
      return {};
    }
    const groupedSessions = sessions.reduce(
      (acc, session) => {
        const formattedDate = dayjs(session.startTime)
          .tz(session.timezone)
          .format('MMMM D, YYYY');
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(session);
        return acc;
      },
      {} as Record<string, Session[]>,
    );

    Object.keys(groupedSessions).forEach((date) => {
      groupedSessions[date].sort((a, b) =>
        dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1,
      );
    });

    return groupedSessions;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const getSessionsByDate = async (targetDate: string) => {
    if (sessions) {
      return sessions.filter((session) => {
        return (
          dayjs(session.startTime)
            .tz(session.timezone)
            .format('MMMM D, YYYY') === targetDate
        );
      });
    }
  };
  const getSessionsByRange = async (targetDate: Dayjs[]) => {
    if (sessions) {
      return sessions.filter((session) => {
        const [start, end] = targetDate;
        const isAfter = dayjs(session.startTime)
          .tz(session.timezone)
          .isSameOrAfter(start, 'day');
        const isBefore = end
          ? dayjs(session.endTime)
              .tz(session.timezone)
              .isSameOrBefore(end, 'day')
          : true;
        return isAfter && isBefore;
      });
    }
  };
  const getSessionsByMonth = async (dateForCalendar: dayjs.Dayjs) => {
    if (sessions) {
      const sessionsbymonth = sessions.filter((session) => {
        const sessionDate = dayjs(session.startTime).tz(session.timezone);
        return (
          sessionDate.month() === dateForCalendar.month() &&
          sessionDate.year() === dateForCalendar.year()
        );
      });
      return sessionsbymonth;
    }
    return [];
  };
  const getRSVPSessions = async () => {
    const { data, error } = await supabase
      .from('rsvp')
      .select('sessionID')
      .eq('userDID', adminId);
    console.log(data);
    if (error) {
      console.error('Failed to fetch RSVP sessions:', error);
      return [];
    }
    const validSessions = data
      .filter((rsvp: { sessionID: string | null }) => rsvp.sessionID !== null)
      .map((rsvp: { sessionID: string }) => rsvp.sessionID);
    return validSessions;
  };
  const getSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('eventId', eventId);
      if (data) {
        setSessions(data);
        return data as Session[];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAndFilterSessions = async () => {
    setLoading(true);
    try {
      let filteredSessions = await getSession();
      if (filteredSessions) {
        if (dateForCalendar && sessionsByDate) {
          filteredSessions = await getSessionsByMonth(dateForCalendar);
        }
        if (selectedDate) {
          filteredSessions = await getSessionsByDate(
            dayjs(selectedDate).tz(eventData?.timezone).format('MMMM D, YYYY'),
          );
        }
        if (selectDateRange) {
          filteredSessions = await getSessionsByRange(selectDateRange);
        }
        if (isManagedFiltered) {
          filteredSessions = filteredSessions?.filter(
            (session) => session.creatorDID === adminId,
          );
        }
        if (isRSVPFiltered) {
          const rsvpSessionIDs = await getRSVPSessions();
          filteredSessions = filteredSessions?.filter((session) =>
            rsvpSessionIDs.includes(session.id),
          );
        }
        if (searchQuery) {
          filteredSessions = filteredSessions?.filter((session) =>
            session.title?.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        if (selectedTracks.length > 0) {
          filteredSessions = filteredSessions?.filter((session) =>
            session.track
              ?.split(',')
              .some((ele) => new Set(selectedTracks).has(ele)),
          );
        }

        if (selectedLocations.length > 0) {
          filteredSessions = filteredSessions?.filter((session) =>
            session.location
              ?.split(',')
              .some((ele) => new Set(selectedLocations).has(ele)),
          );
        }

        if (filteredSessions && filteredSessions.length > 0) {
          setSessionsByDate(groupSessionByDate(filteredSessions));
        } else if (selectedDate) {
          setSessionsByDate({
            [dayjs(selectedDate)
              .tz(eventData?.timezone)
              .format('MMMM D, YYYY')]: [],
          });
        } else {
          setSessionsByDate(undefined);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
      setLoading(false);
    }
  };

  useQuery({
    queryKey: [
      'fetchAndFilterSessions',
      selectedDate,
      selectDateRange,
      dateForCalendar,
      isRSVPFiltered,
      isManagedFiltered,
      searchQuery,
      refreshFlag,
      selectedTracks,
      selectedLocations,
    ],
    queryFn: async () => {
      fetchAndFilterSessions().catch((error) => {
        console.error('An error occurred:', error);
      });
    },
  });

  const handleRSVPSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsRSVPFiltered(event.target.checked);
  };

  const handleManagedSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsManagedFiltered(event.target.checked);
  };

  const getPeople = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          mVPProfileIndex(first: 1000) {
            edges {
              node {
                id
                username
                avatar
                author {
                  id
                }
              }
            }
          }
        }
      `);

      if ('mVPProfileIndex' in response.data) {
        const profileData: ProfileEdge = response.data as ProfileEdge;
        const fetchedPeople: Profile[] = profileData.mVPProfileIndex.edges.map(
          (edge) => edge.node,
        );
        setPeople(fetchedPeople);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sesssions:', error);
    }
  };

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('venues')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setVenues(data);
        const locations = data.map((item) => item.name);
        setLocations(locations);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterSessionClearButton = () => {
    setIsRSVPFiltered(false);
    setIsManagedFiltered(false);
    setSelectedTracks([]);
    setSelectedLocations([]);
  };

  const handleRSVPClick = async (sessionID: string) => {
    try {
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvp')
        .insert({
          userDID: adminId,
          sessionID: sessionID,
        });

      if (rsvpError) {
        throw rsvpError;
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

      setIsRsvped(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (sessionID: string) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionID);
      if (error) {
        throw error;
      }
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let timezone = eventData?.timezone;
      await getPeople();
      await getLocation();
      if (option && option.length > 0) {
        switch (option) {
          case 'RSVP':
            setIsRSVPFiltered(true);
            break;
          case 'Today':
            setSelectDateRange([dayjs().tz(eventData?.timezone)]);
            break;
          default:
            break;
        }
      } else {
        const sessions = await getSession();
        const sessionsbydate = groupSessionByDate(sessions);
        setSessionsByDate(sessionsbydate);
      }
    };
    fetchData();
  }, []);

  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);

  const getBookedSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('location', sessionLocation);
      if (data) {
        setBookedSessions(data);
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        setRefreshFlag((prevFlag) => prevFlag + 1);
      },
      20 * 60 * 1000,
    );
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await getBookedSession();
    };
    fetchData();
  }, [sessionLocation]);

  const List = (anchor: Anchor) => {
    if (anchor === 'right') {
      return (
        <Drawer
          eventData={eventData!}
          locations={locations}
          venues={venues}
          handleClose={() => toggleDrawer('right', false)}
          setBookedSessionsForDay={setBookedSessionsForDay}
          bookedSessionsForDay={bookedSessionsForDay}
          people={people}
          fetchAndFilterSessions={fetchAndFilterSessions}
        />
      );
    }
  };

  const columnRef = useRef<HTMLDivElement>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        bgcolor="#222222"
        direction={'row'}
        justifyContent={'center'}
        boxSizing={'border-box'}
        sx={{
          padding: '40px 20px',
          [theme.breakpoints.down('md')]: {
            padding: '20px',
          },
        }}
      >
        {!selectedSession ? (
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              justifyContent: 'center',
              width: '100%',
              [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                alignItems: 'center',
              },
            }}
          >
            {isTablet && (
              <Stack gap={'20px'} width={'100%'}>
                <Stack
                  borderRadius={'100%'}
                  border={'3px solid rgba(255, 255, 255, 0.10)'}
                  width={'64px'}
                  height={'64px'}
                  bgcolor={'rgba(255, 255, 255, 0.10)'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  position={'fixed'}
                  bottom={'22px'}
                  right={'22px'}
                  zIndex={10}
                  onClick={() => toggleDrawer('right', true)}
                >
                  <PlusIcon size={10} />
                </Stack>
                <Stack direction={'row'} gap={'10px'}>
                  {/*<ZuButton
                    sx={{ width: '100%', flex: '0' }}
                    onClick={() => toggleDrawer('right', true)}
                  >
                    <SearchIcon />
                  </ZuButton>*/}
                  <ZuButton
                    startIcon={<TuneOutlinedIcon />}
                    sx={{ width: '100%', flex: '1 0 0' }}
                    onClick={() => setShowFilterSessionPop(true)}
                  >
                    Filter
                  </ZuButton>
                  <ZuButton
                    startIcon={
                      !isMobile ? <ChevronDoubleRightIcon size={5} /> : null
                    }
                    sx={{ width: '100%', flex: '1 0 0' }}
                    onClick={() => {
                      resetDateFilter();
                      setSelectDateRange([dayjs().tz(eventData?.timezone)]);
                    }}
                  >
                    Show From Today
                  </ZuButton>
                  <ZuButton
                    sx={{ width: '100%', flex: '0' }}
                    onClick={(e) => handleCalendarClick(e)}
                    aria-describedby={
                      calendarOpen ? 'calendar-menu' : undefined
                    }
                  >
                    <CalendarIcon />
                  </ZuButton>
                  <Popover
                    id={calendarOpen ? 'calendar-menu' : undefined}
                    open={calendarOpen}
                    anchorEl={anchorEl}
                    onClose={handleCalendarClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{
                      borderRadius: '14px',
                    }}
                    PaperProps={{
                      sx: {
                        backgroundColor: 'rgba(44, 44, 44, 0.80)',
                        borderRadius: '14px',
                        backdropFilter: 'blur(5px)',
                      },
                    }}
                  >
                    <ZuCalendar
                      value={selectedDate}
                      onChange={(val) => {
                        resetDateFilter();
                        setSelectedDate(val);
                      }}
                      slots={{ day: SlotDates }}
                      slotProps={{
                        day: {
                          highlightedDays: sessions
                            .filter((session) => {
                              return (
                                dayjs(session.startTime)
                                  .tz(eventData?.timezone)
                                  .month() === dateForCalendar.month() &&
                                dayjs(session.startTime)
                                  .tz(eventData?.timezone)
                                  .year() === dateForCalendar.year()
                              );
                            })
                            .filter((session) => {
                              if (selectedDate) {
                                return (
                                  dayjs(session.startTime)
                                    .tz(eventData?.timezone)
                                    .date() !== selectedDate.date()
                                );
                              }
                              return true;
                            })
                            .map((session) => {
                              return dayjs(session.startTime)
                                .tz(eventData?.timezone)
                                .date();
                            }),
                        } as any,
                      }}
                      onMonthChange={(val) => {
                        resetDateFilter();
                        setDateForCalendar(val);
                      }}
                      onYearChange={(val) => {
                        resetDateFilter();
                        setDateForCalendar(val);
                      }}
                    />
                  </Popover>
                </Stack>
              </Stack>
            )}
            <Stack
              borderRadius="10px"
              border="1px solid #383838"
              bgcolor="#262626"
              flex={8}
              position={'relative'}
              sx={{
                width: '700px',
                maxWidth: '700px',
                [theme.breakpoints.down('md')]: {
                  width: '100%',
                  maxWidth: '100%',
                },
              }}
            >
              {loading && !sessionsByDate ? (
                <Stack spacing="10px" padding="10px">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={153}
                      key={index}
                    />
                  ))}
                </Stack>
              ) : sessionsByDate && Object.keys(sessionsByDate).length !== 0 ? (
                Object.entries(sessionsByDate)
                  .sort(([a], [b]) => {
                    const dateA = dayjs(a, 'MMMM D, YYYY')
                      .tz(eventData?.timezone)
                      .toDate()
                      .getTime();
                    const dateB = dayjs(b, 'MMMM D, YYYY')
                      .tz(eventData?.timezone)
                      .toDate()
                      .getTime();
                    return dateA - dateB;
                  })
                  .map(([date, dateSessions]) => (
                    <Stack
                      spacing="10px"
                      padding="10px"
                      key={`Session-GroupByDate-${date}`}
                      position={'relative'}
                      id={dayjs(date, 'MMMM D, YYYY')
                        .tz(eventData?.timezone, true)
                        .format('MMMM-D-YYYY')}
                    >
                      <Typography
                        borderTop="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                        padding="8px 10px"
                        variant="bodySB"
                        bgcolor="rgba(255, 255, 255, 0.05)"
                        borderRadius="10px"
                        sx={{ backdropFilter: 'blur(10px)' }}
                        position={'sticky'}
                        top={'100px'}
                        zIndex={2}
                        display={'flex'}
                      >
                        <Typography component={'span'} flex={1}>
                          {dayjs(date, 'MMMM D, YYYY')
                            .tz(eventData?.timezone, true)
                            .format('dddd · DD MMM YYYY')}
                        </Typography>
                        <ZuButton
                          sx={{ height: '20px' }}
                          onClick={handleDownload(
                            dayjs(date, 'MMMM D, YYYY')
                              .tz(eventData?.timezone, true)
                              .format('MMMM D, YYYY'),
                          )}
                        >
                          <Image
                            src="/session/download.png"
                            alt="download"
                            width={16}
                            height={16}
                          />
                        </ZuButton>
                      </Typography>
                      {dateSessions && dateSessions.length > 0 ? (
                        dateSessions.map((session, index) => (
                          <SessionCard
                            key={`SessionCard-${index}`}
                            session={session}
                            userDID={adminId}
                            eventId={eventId}
                            isLive={
                              dayjs(new Date())
                                .tz(eventData?.timezone)
                                .format('dddd, MMMM D') >
                                dayjs(session.startTime)
                                  .tz(eventData?.timezone)
                                  .format('dddd, MMMM D') &&
                              dayjs(new Date())
                                .tz(eventData?.timezone)
                                .format('dddd, MMMM D') <
                                dayjs(session.endTime)
                                  .tz(eventData?.timezone)
                                  .format('dddd, MMMM D')
                            }
                          />
                        ))
                      ) : (
                        <Stack padding="20px">
                          <Stack
                            direction="column"
                            alignItems="center"
                            bgcolor="#2d2d2d"
                            padding="20px"
                            borderRadius="10px"
                            sx={{ cursor: 'pointer' }}
                          >
                            <PlusCircleIcon color="#6c6c6c" size={15} />
                            <Typography variant="subtitle2">
                              No Sessions
                            </Typography>
                            <ZuButton
                              onClick={() => toggleDrawer('right', true)}
                            >
                              <Typography variant="subtitle2">
                                Create a Session
                              </Typography>
                            </ZuButton>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  ))
              ) : (
                <Stack padding="20px">
                  <Stack
                    direction="column"
                    alignItems="center"
                    bgcolor="#2d2d2d"
                    padding="20px"
                    borderRadius="10px"
                    sx={{ cursor: 'pointer' }}
                  >
                    <PlusCircleIcon color="#6c6c6c" size={15} />
                    <Typography variant="subtitle2">No Sessions</Typography>
                    <ZuButton onClick={() => toggleDrawer('right', true)}>
                      <Typography variant="subtitle2">
                        Create a Session
                      </Typography>
                    </ZuButton>
                  </Stack>
                </Stack>
              )}
            </Stack>
            {!isTablet && (
              <Stack
                ref={columnRef}
                position="sticky"
                spacing={'20px'}
                top="120px"
                sx={{
                  width: '344px',
                  maxWidth: '344px',
                  [theme.breakpoints.down('md')]: {
                    width: '100%',
                    maxWidth: '100%',
                  },
                }}
                height={
                  columnRef ? `${columnRef.current?.clientHeight}px` : 'auto'
                }
              >
                <OutlinedInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Sessions"
                  // onKeyDown={(event) => {
                  //   if (event.keyCode === 13) {
                  //     onSearch();
                  //   }
                  // }}
                  sx={{
                    backgroundColor: '#313131',
                    paddingX: '15px',
                    paddingY: '13px',
                    borderRadius: '10px',
                    height: '35px',
                    border:
                      '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
                    fontFamily: 'Inter',
                    opacity: 0.7,
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start" sx={{ opacity: 0.6 }}>
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
                <Stack
                  sx={{
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                    borderRadius: '10px',
                    border: 'solid 1px rgba(255, 255, 255, 0.10)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <ZuButton
                    startIcon={<PlusCircleIcon />}
                    sx={{ width: '100%' }}
                    onClick={() => toggleDrawer('right', true)}
                  >
                    Add a Session
                  </ZuButton>
                  <Stack gap={'5px'}>
                    <Stack
                      padding="10px"
                      direction="row"
                      alignItems="center"
                      spacing="10px"
                    >
                      <UserPlusIcon />
                      <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                        My RSVPs
                      </Typography>
                      <Stack flex={1} direction="row" justifyContent="end">
                        <ZuSwitch
                          checked={isRSVPFiltered}
                          onChange={handleRSVPSwitchChange}
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      padding="10px"
                      direction="row"
                      alignItems="center"
                      spacing="10px"
                    >
                      <EditIcon />
                      <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                        Managed by me
                      </Typography>
                      <Stack flex={1} direction="row" justifyContent="end">
                        <ZuSwitch
                          checked={isManagedFiltered}
                          onChange={handleManagedSwitchChange}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    borderRadius: '14px',
                    border: 'solid 1px rgba(255, 255, 255, 0.10)',
                  }}
                  alignItems={'flex-start'}
                >
                  <Stack padding={'14px'} width={'100%'} paddingBottom={'0px'}>
                    <Stack
                      direction="row"
                      spacing="10px"
                      padding="8px 10px"
                      sx={{ cursor: 'pointer' }}
                      alignItems="center"
                      bgcolor={'rgba(255, 255, 255, 0.05)'}
                      width="100%"
                      borderRadius={'10px'}
                      onClick={() => {
                        resetDateFilter();
                        setSelectDateRange([dayjs().tz(eventData?.timezone)]);
                      }}
                    >
                      <ChevronDoubleRightIcon size={5} />
                      <ZuButton
                        variant="text"
                        sx={{
                          textTransform: 'none',
                          padding: 0,
                          minWidth: 'auto',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Typography variant="bodyS">Show From Today</Typography>
                      </ZuButton>
                    </Stack>
                  </Stack>
                  <ZuCalendar
                    value={selectedDate}
                    onChange={(val) => {
                      resetDateFilter();
                      setSelectedDate(val);
                    }}
                    slots={{ day: SlotDates }}
                    slotProps={{
                      day: {
                        highlightedDays: sessions
                          .filter((session) => {
                            return (
                              dayjs(session.startTime)
                                .tz(eventData?.timezone)
                                .month() === dateForCalendar.month() &&
                              dayjs(session.startTime)
                                .tz(eventData?.timezone)
                                .year() === dateForCalendar.year()
                            );
                          })
                          .filter((session) => {
                            if (selectedDate) {
                              return (
                                dayjs(session.startTime)
                                  .tz(eventData?.timezone)
                                  .date() !== selectedDate.date()
                              );
                            }
                            return true;
                          })
                          .map((session) => {
                            return dayjs(session.startTime)
                              .tz(eventData?.timezone)
                              .date();
                          }),
                      } as any,
                    }}
                    onMonthChange={(val) => {
                      resetDateFilter();
                      setDateForCalendar(val);
                    }}
                    onYearChange={(val) => {
                      resetDateFilter();
                      setDateForCalendar(val);
                    }}
                    sx={{
                      border: 'none',
                      height: '300px',
                    }}
                  />
                </Stack>
                <Stack gap={'15px'}>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    padding={'10px'}
                    borderRadius={'10px'}
                    border={'solid 1px rgba(255, 255, 255, 0.10)'}
                    aria-describedby={trackAnchorId}
                    onClick={handleTrackFilterClick}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                    spacing={'10px'}
                  >
                    <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                      <MapOutlinedIcon />
                      <Typography
                        fontSize={'14px'}
                        lineHeight={'160%'}
                        sx={{
                          opacity: '0.6',
                        }}
                      >
                        Track
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography
                        fontSize={'14px'}
                        fontWeight={'600'}
                        lineHeight={'160%'}
                        sx={{
                          opacity: '0.6',
                        }}
                      >
                        {selectedTracks.length
                          ? selectedTracks.join(', ')
                          : 'All'}
                      </Typography>
                      <ChevronRightIcon />
                    </Stack>
                  </Stack>

                  <Popover
                    id={trackAnchorId}
                    open={trackAnchorOpen}
                    anchorEl={trackAnchor}
                    onClose={handleTrackFilterClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          maxHeight: '200px',
                          backgroundColor: 'rgba(34, 34, 34, 0.8)',
                          backdropFilter: 'blur(20px)',
                          width: '344px',
                        },
                      },
                    }}
                  >
                    {eventData &&
                      [...new Set(eventData.tracks?.split(','))].map(
                        (item: string, index) => {
                          return (
                            <MenuItem
                              key={index}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                              onClick={() => {
                                if (selectedTracks.includes(item)) {
                                  const temp = selectedTracks.filter(
                                    (track) => track !== item,
                                  );
                                  setSelectedTracks(temp);
                                } else {
                                  const temp = [...selectedTracks, item];
                                  const uniqueArray = [...new Set(temp)];
                                  setSelectedTracks(uniqueArray);
                                }
                              }}
                            >
                              {item}
                              {selectedTracks.includes(item) && (
                                <HighlightOffIcon />
                              )}
                            </MenuItem>
                          );
                        },
                      )}
                  </Popover>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    padding={'10px'}
                    borderRadius={'10px'}
                    border={'solid 1px rgba(255, 255, 255, 0.10)'}
                    aria-describedby={locationAnchorId}
                    onClick={handleLocationFilterClick}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                    spacing={'10px'}
                  >
                    <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                      <MapIcon />
                      <Typography
                        fontSize={'14px'}
                        lineHeight={'160%'}
                        sx={{
                          opacity: '0.6',
                        }}
                      >
                        Location
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography
                        fontSize={'14px'}
                        fontWeight={'600'}
                        lineHeight={'160%'}
                        sx={{
                          opacity: '0.6',
                        }}
                      >
                        {selectedLocations.length
                          ? selectedLocations.join(', ')
                          : 'All'}
                      </Typography>
                      <ChevronRightIcon />
                    </Stack>
                  </Stack>
                  <Popover
                    id={locationAnchorId}
                    open={locationAnchorOpen}
                    anchorEl={locationAnchor}
                    onClose={handleLocationFilterClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          maxHeight: '200px',
                          backgroundColor: 'rgba(34, 34, 34, 0.8)',
                          backdropFilter: 'blur(20px)',
                          width: '344px',
                        },
                      },
                    }}
                  >
                    {venues &&
                      venues
                        .filter((v) => v.name)
                        .map((item, index) => {
                          return (
                            <MenuItem
                              key={index}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                              onClick={() => {
                                if (selectedLocations.includes(item.name)) {
                                  const temp = selectedLocations.filter(
                                    (location) => location !== item.name,
                                  );
                                  setSelectedLocations(temp);
                                } else {
                                  const temp = [
                                    ...selectedLocations,
                                    item.name,
                                  ];
                                  const uniqueArray = [...new Set(temp)];
                                  setSelectedLocations(uniqueArray);
                                }
                              }}
                            >
                              {item.name}
                              {selectedLocations.includes(item.name) && (
                                <HighlightOffIcon />
                              )}
                            </MenuItem>
                          );
                        })}
                  </Popover>
                </Stack>
              </Stack>
            )}
          </Stack>
        ) : (
          <Stack
            direction={isTablet ? 'column' : 'row'}
            gap="20px"
            justifyContent="center"
          >
            <Stack
              borderRadius="10px"
              border={!isMobile ? '1px solid #383838' : 'none'}
              bgcolor={!isMobile ? '#2d2d2d' : 'transparent'}
              width={isMobile ? '100%' : '600px'}
            >
              <Stack padding={!isMobile ? '10px' : '10px 10px 10px 0'}>
                <ZuButton
                  startIcon={<LeftArrowIcon />}
                  onClick={() => {
                    setSelectedSession(undefined);
                    setIsRsvped(false);
                    setShowDeleteButton(false);
                    fetchAndFilterSessions();
                  }}
                >
                  Back to List
                </ZuButton>
              </Stack>
              <Stack padding={!isMobile ? '20px' : '0 0 20px'} spacing="20px">
                <Stack spacing="10px">
                  {dayjs(new Date())
                    .tz(eventData?.timezone)
                    .format('dddd, MMMM D') >
                    dayjs(selectedSession.startTime)
                      .tz(eventData?.timezone)
                      .format('dddd, MMMM D') &&
                    dayjs(new Date())
                      .tz(eventData?.timezone)
                      .format('dddd, MMMM D') <
                      dayjs(selectedSession.endTime)
                        .tz(eventData?.timezone)
                        .format('dddd, MMMM D') && (
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
                          {selectedSession.track}
                        </Typography>
                      </Stack>
                    )}

                  <Stack direction="row" alignItems="center" spacing="14px">
                    <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                      {dayjs(selectedSession.startTime)
                        .tz(eventData?.timezone)
                        .format('dddd, MMMM D')}
                    </Typography>
                    <Typography variant="bodyS">
                      {dayjs(selectedSession.startTime)
                        .tz(eventData?.timezone)
                        .format('h:mm A')}{' '}
                      -{' '}
                      {dayjs(selectedSession.endTime)
                        .tz(eventData?.timezone)
                        .format('h:mm A')}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="subtitleLB">
                  {selectedSession.title}
                </Typography>
                <Stack spacing="10px">
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <MapIcon size={4} />
                    {selectedSession.format === 'online' ? (
                      <Link
                        href={selectedSession.video_url || ''}
                        target="_blank"
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography
                          variant="bodyM"
                          color="white"
                          sx={{ opacity: 0.5 }}
                        >
                          {selectedSession.video_url}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                        {selectedSession.location}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction={'row'} spacing={1} alignItems="center">
                    <Typography variant="bodyS" sx={{ opacity: 0.7 }}>
                      Speakers:
                    </Typography>
                    {JSON.parse(selectedSession.speakers).map(
                      (speaker: any, index: number) => (
                        <Stack
                          key={`Speaker-${index}`}
                          direction={'row'}
                          spacing="4px"
                          alignItems={'center'}
                        >
                          <Box
                            component={'img'}
                            height={24}
                            width={24}
                            borderRadius={12}
                            src={speaker.avatar || '/user/avatar_p.png'}
                          />
                          <Typography variant="bodyB">
                            {speaker.username}
                          </Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="end" spacing="5px">
                  <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                    By:
                  </Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                    {JSON.parse(selectedSession.organizers)[0].username}
                  </Typography>
                </Stack>
                <Stack spacing="10px">
                  <Stack
                    direction="row"
                    padding="10px 14px"
                    alignItems="center"
                    spacing="10px"
                    border="1px solid rgba(255, 255, 255, 0.10)"
                    borderRadius="10px"
                    bgcolor="#383838"
                    justifyContent="center"
                  >
                    <SessionIcon />
                    {isRsvped ? (
                      <Typography variant="bodyBB">RSVP Confirmed</Typography>
                    ) : (
                      <Typography
                        variant="bodyBB"
                        onClick={() => handleRSVPClick(selectedSession.id)}
                      >
                        RSVP Session
                      </Typography>
                    )}
                  </Stack>
                  {/*<Typography variant="bodyS">Attending: 000</Typography>*/}
                </Stack>
              </Stack>
              {selectedSession.video_url && (
                <Stack spacing="14px" padding="20px">
                  <Typography variant="subtitleSB" sx={{ opacity: 0.6 }}>
                    Video Stream
                  </Typography>
                  <Stack
                    height="421px"
                    borderRadius="10px"
                    bgcolor="black"
                  ></Stack>
                </Stack>
              )}
              <Stack spacing="20px" padding={!isMobile ? '20px' : '0 0 20px'}>
                <Typography variant="subtitleSB">Description</Typography>
                <EditorPreview
                  value={selectedSession.description}
                  collapsed={isCollapsed}
                  onCollapse={(collapsed) => {
                    setIsCanCollapse((v) => {
                      return v || collapsed;
                    });
                    setIsCollapsed(collapsed);
                  }}
                />
                {isCanCollapse && (
                  <ZuButton
                    startIcon={
                      isCollapsed ? (
                        <ChevronDownIcon size={4} />
                      ) : (
                        <ChevronUpIcon size={4} />
                      )
                    }
                    sx={{ backgroundColor: '#313131', width: '100%' }}
                    onClick={() => setIsCollapsed((prev) => !prev)}
                  >
                    {isCollapsed ? 'Show More' : 'Show Less'}
                  </ZuButton>
                )}
              </Stack>
              <Stack padding={!isMobile ? '20px' : '0 0 20px'} spacing="20px">
                <Stack spacing="10px">
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                      Last Edited By:
                    </Typography>
                    <Typography variant="bodyS">
                      {JSON.parse(selectedSession.organizers)[0].username}
                    </Typography>
                    <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                      {formatDateAgo(selectedSession.createdAt)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                      Edited By:
                    </Typography>
                    <Typography variant="bodyS">
                      {JSON.parse(selectedSession.organizers)[0].username}
                    </Typography>
                    <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                      {formatDateAgo(selectedSession.createdAt)}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="bodySB" sx={{ opacity: 0.5 }}>
                  View All Edit Logs
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing="20px" width={isMobile ? '100%' : '320px'}>
              <Stack
                padding="14px 14px 14px 0"
                borderBottom="1px solid #383838"
              >
                <Typography variant="subtitleMB">Session Details</Typography>
              </Stack>
              <Stack spacing="10px">
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Format:
                  </Typography>
                  <Typography variant="bodyM" textTransform="uppercase">
                    {selectedSession.format}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Type:
                  </Typography>
                  <Typography variant="bodyM">
                    {selectedSession.type}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Experience Level:
                  </Typography>
                  <Typography variant="bodyM">
                    {selectedSession.experience_level}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                divider={<Divider sx={{ border: '1px solid #383838' }} />}
                spacing="20px"
              >
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px" alignItems="center">
                    {/*<Cog6Icon size={5} />*/}
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Session Organizers
                    </Typography>
                  </Stack>
                  <Stack
                    flexWrap="wrap"
                    gap="10px"
                    direction="row"
                    alignItems="center"
                  >
                    {JSON.parse(selectedSession.organizers).map(
                      (organizer: any, index: number) => (
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
                            src={organizer.avatar || '/user/avatar_p.png'}
                          />
                          <Typography variant="bodyS">
                            {organizer.username}
                          </Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <MicrophoneIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Speakers
                    </Typography>
                  </Stack>
                  <Stack flexWrap="wrap" gap="10px" direction="row">
                    {JSON.parse(selectedSession.speakers).map(
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
                          <Typography variant="bodyS">
                            {speaker.username}
                          </Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <TagIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Tags
                    </Typography>
                  </Stack>
                  <Stack flexWrap="wrap" gap="10px" direction="row">
                    {selectedSession.tags
                      ?.split(',')
                      .map((tag: any, index: number) => (
                        <Stack
                          key={`Speaker-${index}`}
                          padding="4px 8px"
                          alignItems={'center'}
                          bgcolor="#2d2d2d"
                          borderRadius="10px"
                        >
                          <Typography variant="bodyS" textTransform="uppercase">
                            {tag}
                          </Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <MapIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Location
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing="20px">
                    <Box
                      component="img"
                      borderRadius="10px"
                      width="80px"
                      height="80px"
                      src={'/26.png'}
                    />
                    <Stack alignItems="center">
                      <Typography variant="bodyM">
                        {selectedSession.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                {showDeleteButton && (
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                    sx={{ marginTop: 2 }}
                  >
                    <ZuButton
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(selectedSession.id)}
                    >
                      Delete
                    </ZuButton>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        )}
        <SwipeableDrawer
          hideBackdrop={true}
          sx={{
            position: 'relative',
            zIndex: 1001,
            '& .MuiDrawer-paper': {
              height: '100vh',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            },
            [theme.breakpoints.down('sm')]: {
              width: '100%',
              padding: '0px',
            },
          }}
          anchor="right"
          open={state['right']}
          onClose={() => toggleDrawer('right', false)}
          onOpen={() => toggleDrawer('right', true)}
        >
          {List('right')}
        </SwipeableDrawer>
        <FilterSessionPop
          sx={{
            position: 'relative',
            zIndex: 3,
            '& .MuiDrawer-paper': {
              marginTop: '50px',
              height: 'calc(100% - 50px)',
              width: '100%',
              boxShadow: 'none',
              backgroundColor: 'rgba(34, 34, 34, 0.90)',
              backdropFilter: 'blur(10px)',
            },
          }}
          hideBackdrop={false}
          anchor="right"
          open={showFilterSessionPop}
          onClose={() => setShowFilterSessionPop(false)}
          onOpen={() => setShowFilterSessionPop(true)}
          isRSVPFiltered={isRSVPFiltered}
          handleRSVPSwitchChange={handleRSVPSwitchChange}
          isManagedFiltered={isManagedFiltered}
          handleManagedSwitchChange={handleManagedSwitchChange}
          location={venues}
          track={eventData?.tracks ?? ''}
          handleClear={handleFilterSessionClearButton}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default Sessions;
