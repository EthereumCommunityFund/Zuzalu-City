'use client';
import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Stack,
  Grid,
  Typography,
  SwipeableDrawer,
  Divider,
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import { TimeView } from '@mui/x-date-pickers/models';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from '@/utils/dayjs';
import { ZuInput, ZuButton, ZuSwitch, ZuCalendar } from '@/components/core';
import {
  PlusCircleIcon,
  LockIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  FingerPrintIcon,
  UserPlusIcon,
  EditIcon,
  QueueListIcon,
  ChevronDoubleRightIcon,
  LeftArrowIcon,
  MapIcon,
  SessionIcon,
  Cog6Icon,
  MicrophoneIcon,
  TagIcon,
  PlusIcon,
  MinusIcon,
} from '@/components/icons';
import SessionCard from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Sessions/components/SessionList/SessionCard';
import BpCheckbox from '@/components/event/Checkbox';
import {
  Anchor,
  Session,
  SessionData,
  ProfileEdge,
  Profile,
  CeramicResponseType,
  EventEdge,
  Venue,
  Event,
} from '@/types';
import { SPACE_CATEGORIES, EXPREIENCE_LEVEL_TYPES } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { supabase } from '@/utils/supabase/client';
import { SessionSupabaseData } from '@/types';
import { supaCreateSession } from '@/services/session';
import Link from 'next/link';
import formatDateAgo from '@/utils/formatDateAgo';
import SlotDate from '@/components/calendar/SlotDate';
import ZuAutoCompleteInput from '@/components/input/ZuAutocompleteInput';
import SelectCategories from '@/components/select/selectCategories';
import SelectSearchUser from '@/components/select/selectSearchUser';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { SuperEditor } from '@/components/editor/SuperEditor';
import { useEditorStore } from '@/components/editor/useEditorStore';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import { EditorPreview } from '@/components/editor/EditorPreview';
import SlotDates from '@/components/calendar/SlotDate';
import { v4 as uuidv4 } from 'uuid';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

interface ISessions {
  eventData: Event | undefined;
  option?: string;
}

const Sessions: React.FC<ISessions> = ({ eventData, option }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();
  const params = useParams();
  const eventId = params.eventid.toString();
  const profileId = profile?.id || '';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [directions, setDirections] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isDirections, setIsDirections] = useState<boolean>(false);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isRSVPFiltered, setIsRSVPFiltered] = useState(false);
  const [isManagedFiltered, setIsManagedFiltered] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Venue>();
  const [selectedSession, setSelectedSession] = useState<Session>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRsvped, setIsRsvped] = useState<boolean>(false);
  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [sessionsByDate, setSessionsByDate] =
    useState<Record<string, Session[]>>();
  const [bookedSessionsForDay, setBookedSessionsForDay] = useState<Session[]>(
    [],
  );

  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionTrack, setSessionTrack] = useState<string>('');
  const [sessionTags, setSessionTags] = useState<string[]>([]);
  const sessionDescriptionEditorStore = useEditorStore();
  const [sessionType, setSessionType] = useState<string>('');
  const [sessionExperienceLevel, setSessionExperienceLevel] =
    useState<string>('');
  // const [sessionFormat, setSessionFormat] = useState<string>("");
  const [sessionVideoURL, setSessionVideoURL] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<Dayjs | null>();
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs>(
    dayjs().set('hour', 0).set('minute', 0),
  );
  const adminId = ceramic?.did?.parent || '';
  const [sessionEndTime, setSessionEndTime] = useState<Dayjs>(
    dayjs().set('hour', 0).set('minute', 0),
  );
  const [sessionOrganizers, setSessionOrganizers] = useState<Array<any>>([
    profile,
  ]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<any>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>('');
  const [sessionLiveStreamLink, setSessionLiveStreamLink] =
    useState<string>('');
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hiddenOrganizer, setHiddenOrganizer] = useState(false);
  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
    const sessions = await getSession();
    if (sessions) {
      return sessions.filter(
        (session) =>
          dayjs(session.startTime)
            .tz(session.timezone)
            .format('MMMM D, YYYY') === targetDate,
      );
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
    if (error) {
      console.error('Failed to fetch RSVP sessions:', error);
      return [];
    }
    return data.map((rsvp: { sessionID: string }) => rsvp.sessionID);
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
        if (dateForCalendar) {
          filteredSessions = await getSessionsByMonth(dateForCalendar);
        }
        if (selectedDate) {
          filteredSessions = await getSessionsByDate(
            dayjs(selectedDate).tz(eventData?.timezone).format('MMMM D, YYYY'),
          );
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

  useEffect(() => {
    fetchAndFilterSessions().catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [
    selectedDate,
    dateForCalendar,
    isRSVPFiltered,
    isManagedFiltered,
    searchQuery,
  ]);
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

  const handleDateChange = (date: Dayjs) => {
    if (date && person && sessionLocation !== 'Custom') {
      const dayName = date.format('dddd'); // Get the day name (e.g., 'Monday')
      const selectedDay = date.format('YYYY-MM-DD');
      if (sessionLocation == '') {
        return;
      }
      const available = JSON.parse(
        venues.filter((item) => item.name === sessionLocation)[0].bookings,
      );
      setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
      const bookedSessionsDay = bookedSessions.filter((session) => {
        const sessionStartDay = dayjs(session.startTime).format('YYYY-MM-DD');

        return sessionStartDay === selectedDay;
      });

      setBookedSessionsForDay(bookedSessionsDay);
    }
    setSessionDate(date);
    setSessionStartTime(dayjs().set('hour', 0).set('minute', 0));
    setSessionEndTime(dayjs().set('hour', 0).set('minute', 0));
  };

  const isDateInRange = (
    date: Dayjs,
    startDate?: string,
    endDate?: string,
  ): boolean => {
    return (
      date.isAfter(dayjs(startDate).subtract(1, 'day')) &&
      date.isBefore(dayjs(endDate).add(1, 'day'))
    );
  };

  const isTimeAvailable = (date: Dayjs, isStart: boolean): boolean => {
    let timezone = eventData?.timezone;
    if (sessionDate == null) return true;
    const formattedTime = date.format('HH:mm');
    const isWithinBookedSession = bookedSessionsForDay.some((session) => {
      const sessionStartTime = dayjs(session.startTime)
        .tz('UTC')
        .tz(timezone)
        .format('HH:mm');
      const sessionEndTime = dayjs(session.endTime)
        .tz('UTC')
        .tz(timezone)
        .format('HH:mm');
      return (
        (formattedTime >= sessionStartTime && formattedTime < sessionEndTime) ||
        (formattedTime <= sessionStartTime &&
          formattedTime >= sessionEndTime) ||
        (isStart
          ? formattedTime >= sessionStartTime && formattedTime < sessionEndTime
          : formattedTime > sessionStartTime && formattedTime <= sessionEndTime)
      );
    });

    const isMinuteIntervalValid = date.minute() % 30 === 0;
    const isWithinAvailableSlot = availableTimeSlots.some((slot: any) => {
      let startTime;
      let endTime;
      if (isStart) {
        const startTime = dayjs
          .tz(slot.startTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        const endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        if (endTime >= startTime) {
          return formattedTime >= startTime && formattedTime < endTime;
        } else {
          return !(formattedTime < startTime && formattedTime >= endTime);
        }
      } else {
        startTime = sessionStartTime.tz(timezone).format('HH:mm');
        endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        if (endTime >= startTime) {
          return formattedTime >= startTime && formattedTime <= endTime;
        } else {
          return !(formattedTime < startTime && formattedTime > endTime);
        }
      }
    });

    return isWithinAvailableSlot && !isWithinBookedSession;
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

  const handleChange = (val: string[]) => {
    setSessionTags(val);
  };

  const handleSpeakerChange = (users: Profile[]) => {
    setSessionSpeakers(users);
  };

  const handleOrganizerChange = (users: Profile[]) => {
    setSessionOrganizers(users);
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
  const isSessionOverlap = (
    bookedSessions: Session[],
    startTime: Dayjs,
    endTime: Dayjs,
  ) => {
    const newSessionStart = startTime;
    const newSessionEnd = endTime;
    let timezone = eventData?.timezone;
    for (let session of bookedSessions) {
      const sessionStart = dayjs(session.startTime).tz('UTC').tz(timezone);
      const sessionEnd = dayjs(session.endTime).tz('UTC').tz(timezone);

      if (
        (newSessionStart.isSameOrBefore(sessionEnd) &&
          newSessionStart.isSameOrAfter(sessionStart)) ||
        (newSessionEnd.isSameOrBefore(sessionEnd) &&
          newSessionEnd.isSameOrAfter(sessionStart)) ||
        (newSessionStart.isBefore(sessionStart) &&
          newSessionEnd.isAfter(sessionEnd))
      ) {
        return true;
      }
    }
    return false;
  };

  const createSession = async () => {
    if (!isAuthenticated) {
      return;
    }

    let timezone = eventData?.timezone;

    const description = sessionDescriptionEditorStore.getValueString();
    const format = person ? 'person' : 'online';

    const error =
      !eventId ||
      !sessionStartTime ||
      !description ||
      !sessionEndTime ||
      !sessionName ||
      !sessionTrack ||
      !sessionOrganizers ||
      !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert('Please fill necessary fields!');
      return;
    } else if (dayjs(sessionEndTime).utc() <= dayjs(sessionStartTime).utc()) {
      typeof window !== 'undefined' &&
        window.alert('Please check the input session time');
      return;
    } else if (
      isSessionOverlap(
        bookedSessionsForDay,
        dayjs(sessionStartTime).tz('UTC').tz(timezone),
        dayjs(sessionEndTime).tz('UTC').tz(timezone),
      )
    ) {
      typeof window !== 'undefined' &&
        window.alert('The new session overlaps with an existing session');
      return;
    }

    if (format === 'person') {
      if (sessionLocation === 'Custom' && !customLocation) {
        typeof window !== 'undefined' &&
          window.alert('Please fill custom location field');
        return;
      }
      if (!sessionLocation) {
        typeof window !== 'undefined' &&
          window.alert('Please fill location field');
        return;
      }
    } else {
      if (!sessionVideoURL) {
        typeof window !== 'undefined' &&
          window.alert('Please fill virtual location field');
        return;
      }
    }

    const formattedData: SessionSupabaseData = {
      title: sessionName,
      description,
      experience_level: sessionExperienceLevel,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      startTime: sessionStartTime
        ? dayjs(sessionStartTime)
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss[Z]')
            .toString()
        : null,
      endTime: sessionEndTime
        ? dayjs(sessionEndTime)
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss[Z]')
            .toString()
        : null,
      profileId,
      eventId,
      tags: sessionTags.join(','),
      type: sessionType,
      format,
      track: sessionTrack,
      timezone: timezone,
      video_url: sessionVideoURL,
      location:
        sessionLocation === 'Custom'
          ? `Custom Location: ${customLocation} ${directions}`
          : sessionLocation,
      organizers: JSON.stringify(sessionOrganizers),
      speakers: JSON.stringify(sessionSpeakers),
      creatorDID: adminId,
      uuid: uuidv4(),
    };
    try {
      setBlockClickModal(true);
      const response = await supaCreateSession(formattedData);
      if (response.status === 200) {
        await fetchAndFilterSessions();
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
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
            setSelectedDate(dayjs().tz(timezone));
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getBookedSession();
    };
    fetchData();
  }, [sessionLocation]);

  const List = (anchor: Anchor) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          title="Session Created"
          message="Please view it."
          showModal={showModal}
          onClose={() => {
            toggleDrawer('right', false);
            setShowModal(false);
            fetchAndFilterSessions();
          }}
          onConfirm={() => {
            toggleDrawer('right', false);
            setShowModal(false);
            fetchAndFilterSessions();
          }}
        />
        <Dialog
          showModal={blockClickModal}
          showActions={false}
          title="Creating Session"
          message="Please wait while the session is being created..."
        />
        <Box
          sx={{
            width:
              anchor === 'top' || anchor === 'bottom'
                ? 'auto'
                : isMobile
                  ? '100%'
                  : '762px',
            backgroundColor: '#222222',
          }}
          role="presentation"
          zIndex="100"
          borderLeft="1px solid #383838"
        >
          <Box
            display="flex"
            alignItems="center"
            height="50px"
            borderBottom="1px solid #383838"
            paddingX={3}
            gap={2}
          >
            <ZuButton
              startIcon={<XMarkIcon />}
              onClick={() => toggleDrawer('right', false)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              Close
            </ZuButton>
            <Typography variant="subtitleSB">Create Session</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitleMB">Create a Session</Typography>
              {/*<ZuButton
                startIcon={<ArchiveBoxIcon size={5} />}
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Save Draft
              </ZuButton>*/}
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Session Details</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Name*</Typography>
                <ZuInput
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Input a name"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Select a Track*</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Attach a relevant track this session relates to
                </Typography>
                <Select
                  value={sessionTrack}
                  style={{ width: '100%' }}
                  onChange={(e) => setSessionTrack(e.target.value)}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#222222',
                        maxHeight: 200,
                        overflow: 'auto',
                      },
                    },
                  }}
                >
                  {eventData?.tracks?.split(',').map((i, index) => {
                    return (
                      <MenuItem value={i} key={`EventTrack_Index${index}`}>
                        {i}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Session Tags</Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                    Search or create categories related to your space
                  </Typography>
                </Stack>
                <SelectCategories onChange={handleChange} />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Description*</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Write an introduction for this session
                </Typography>
                <SuperEditor
                  onChange={(val) => {
                    sessionDescriptionEditorStore.setValue(val);
                  }}
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Type</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Choose a type for your session to relay its nature to guests
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="Meetup, Activity, Party, etc.."
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Experience Level</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Select a level experience may be needed for this session
                </Typography>
                <Select
                  value={sessionExperienceLevel}
                  style={{ width: '100%' }}
                  onChange={(e) => setSessionExperienceLevel(e.target.value)}
                  input={<OutlinedInput label="Experience_Level" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#222222',
                      },
                    },
                  }}
                >
                  {EXPREIENCE_LEVEL_TYPES.map((i, index) => {
                    return (
                      <MenuItem value={i.key} key={`Speaker_Index${index}`}>
                        {i.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Live-Stream Link</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Enter a link for where this session will be streamed
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionLiveStreamLink(e.target.value)}
                  placeholder="https://"
                />
              </Stack>
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Location & Booking</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Format*</Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  gap="20px"
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <Box
                    bgcolor={person ? '#484E45' : '#373737'}
                    borderRadius="10px"
                    padding="10px"
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    flex={1}
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={person} />
                    <Stack>
                      <Typography
                        color="white"
                        fontSize="16px"
                        fontWeight={600}
                        fontFamily="Inter"
                      >
                        In-Person
                      </Typography>
                      <Typography
                        color="white"
                        fontSize="10px"
                        fontFamily="Inter"
                      >
                        This is a physical event
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    bgcolor={online ? '#484E45' : '#373737'}
                    borderRadius="10px"
                    padding="10px"
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    flex={1}
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={online} />
                    <Stack>
                      <Typography
                        color="white"
                        fontSize="16px"
                        fontWeight={600}
                        fontFamily="Inter"
                      >
                        Online
                      </Typography>
                      <Typography
                        color="white"
                        fontSize="10px"
                        fontFamily="Inter"
                      >
                        Specially Online Event
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
              {person && (
                <Stack spacing="30px">
                  <Stack spacing="10px">
                    <Typography variant="bodyBB">Select Location*</Typography>
                    <Typography variant="bodyS">
                      Book a location to host this session
                    </Typography>
                    <Select
                      value={sessionLocation}
                      onChange={(e) => {
                        const selectedRoom = venues.filter(
                          (item) => item.name === e.target.value,
                        )[0];
                        setSelectedRoom(selectedRoom);
                        setSessionLocation(e.target.value);
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#222222',
                            maxHeight: 200,
                            overflow: 'auto',
                          },
                        },
                      }}
                    >
                      {locations.map((location, index) => (
                        <MenuItem
                          key={`Location-Index${index}`}
                          value={location}
                        >
                          {location}
                        </MenuItem>
                      ))}
                      <MenuItem key="custom_location" value="Custom">
                        Custom
                      </MenuItem>
                    </Select>
                    {sessionLocation && sessionLocation !== 'Custom' && (
                      <Stack>
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          borderRadius="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          spacing="10px"
                          padding="10px"
                        >
                          <Typography variant="caption">
                            Your are booking at:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            direction="row"
                            spacing="10px"
                          >
                            <Box
                              component="img"
                              width="60px"
                              height="60px"
                              borderRadius="8px"
                              src={selectedRoom?.avatar}
                            />
                            <Stack spacing="4px">
                              <Typography variant="bodyBB">
                                {sessionLocation}
                              </Typography>
                              {/*<Typography variant="bodyS">
                                Sessions booked: {bookedSessions.length}
                              </Typography>*/}
                              <Typography variant="caption">
                                Capacity: {selectedRoom?.capacity}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                    {sessionLocation && sessionLocation === 'Custom' && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack spacing="10px">
                          <FormLabel>Custom Location</FormLabel>
                          <FormLabelDesc>
                            Write name of the location
                          </FormLabelDesc>
                          <ZuInput
                            placeholder="Type location name"
                            onChange={(e) => setCustomLocation(e.target.value)}
                          />
                          <ZuButton
                            endIcon={
                              !isDirections ? (
                                <PlusIcon size={4} />
                              ) : (
                                <MinusIcon size={4} />
                              )
                            }
                            onClick={() => setIsDirections((prev) => !prev)}
                          >
                            {!isDirections
                              ? 'Add Directions'
                              : 'Remove Directions'}
                          </ZuButton>
                          {isDirections && (
                            <ZuInput
                              placeholder="Directions description"
                              onChange={(e) => setDirections(e.target.value)}
                            />
                          )}
                          {customLocation && (
                            <Stack
                              borderRadius="10px"
                              border="1px solid #383838"
                              padding="10px"
                              spacing="10px"
                            >
                              <Typography variant="caption">
                                CUSTOM LOCATIONS:
                              </Typography>
                              <Stack
                                borderRadius="10px"
                                bgcolor="#373737"
                                padding="10px"
                              >
                                <Typography variant="bodyBB">
                                  {customLocation}
                                </Typography>
                                <Typography variant="bodyS">
                                  {directions}
                                </Typography>
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  {sessionLocation && (
                    <Stack spacing="20px">
                      <Stack spacing="10px">
                        <Typography variant="bodyBB">Book a Date*</Typography>
                        <Typography variant="bodyS">
                          View and select the available dates and times for this
                          location
                        </Typography>
                        <Typography variant="bodyB">
                          Your booking will be at the event timezone:{' '}
                          {eventData?.timezone}
                        </Typography>
                        <DesktopDatePicker
                          onChange={(newValue) => {
                            if (newValue !== null) handleDateChange(newValue);
                          }}
                          shouldDisableDate={(date: Dayjs) =>
                            !isDateInRange(
                              date,
                              eventData?.startTime,
                              eventData?.endTime,
                            )
                          }
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          slotProps={{
                            popper: {
                              sx: {
                                '& .MuiPickersDay-root': { color: 'black' },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#D7FFC4',
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                  color: 'black',
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                      {sessionDate && (
                        <Stack direction="row" spacing="20px">
                          <Stack spacing="10px" flex={1}>
                            <Typography variant="bodyBB">Start Time</Typography>
                            <DesktopTimePicker
                              value={sessionStartTime}
                              ampm={false}
                              onChange={(newValue) => {
                                if (newValue !== null) {
                                  const combined = dayjs(sessionDate)
                                    .set('hour', newValue.hour())
                                    .set('minute', newValue.minute());
                                  setSessionStartTime(combined);
                                }
                              }}
                              shouldDisableTime={(
                                date: Dayjs,
                                view: TimeView,
                              ) => {
                                if (
                                  (view === 'minutes' || view === 'hours') &&
                                  sessionLocation !== 'Custom'
                                ) {
                                  return !isTimeAvailable(date, true);
                                }
                                return false;
                              }}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#313131',
                                  borderRadius: '10px',
                                },
                              }}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPickersDay-root': { color: 'black' },
                                    '& .MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#D7FFC4',
                                    },
                                    '& .MuiPickersCalendarHeader-root': {
                                      color: 'black',
                                    },
                                    '& .MuiMultiSectionDigitalClock-root': {
                                      color: 'black',
                                    },
                                  },
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing="10px" flex={1}>
                            <Typography variant="bodyBB">End Time</Typography>
                            <DesktopTimePicker
                              value={sessionEndTime}
                              ampm={false}
                              onChange={(newValue) => {
                                if (newValue !== null) {
                                  const combined = dayjs(sessionDate)
                                    .set('hour', newValue.hour())
                                    .set('minute', newValue.minute());
                                  setSessionEndTime(combined);
                                }
                              }}
                              shouldDisableTime={(
                                date: Dayjs,
                                view: TimeView,
                              ) => {
                                if (
                                  (view === 'minutes' || view === 'hours') &&
                                  sessionLocation !== 'Custom'
                                ) {
                                  return !isTimeAvailable(date, false);
                                }
                                return false;
                              }}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#313131',
                                  borderRadius: '10px',
                                },
                              }}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPickersDay-root': { color: 'black' },
                                    '& .MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#D7FFC4',
                                    },
                                    '& .MuiPickersCalendarHeader-root': {
                                      color: 'black',
                                    },
                                    '& .MuiMultiSectionDigitalClock-root': {
                                      color: 'black',
                                    },
                                  },
                                },
                              }}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  )}

                  {sessionLocation &&
                    sessionDate &&
                    sessionStartTime !==
                      dayjs().set('hour', 0).set('minute', 0) &&
                    sessionEndTime !==
                      dayjs().set('hour', 0).set('minute', 0) && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          spacing="10px"
                          padding="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          borderRadius="10px"
                        >
                          <Typography variant="caption">
                            Date & times your are booking:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            spacing="10px"
                          >
                            <Typography variant="bodyBB">
                              {`${sessionDate.format('MMMM')}` +
                                ' ' +
                                `${sessionDate.format('DD')}` +
                                ', ' +
                                `${sessionDate.format('YYYY')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              Start Time:{' '}
                              {`${sessionStartTime.format('hh:mm A')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              End Time: :{' '}
                              {`${sessionEndTime.format('hh:mm A')}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                </Stack>
              )}
              {online && (
                <Stack spacing="30px">
                  <Stack spacing="10px">
                    <Typography variant="bodyBB">Virtual Location</Typography>
                    <Typography variant="bodyS">
                      Provide a URL where this session will be hosted
                    </Typography>
                    <ZuInput
                      onChange={(e) => setSessionVideoURL(e.target.value)}
                      placeholder="https://"
                    />
                  </Stack>
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <Typography variant="bodyBB">Select a Date</Typography>
                      <Typography variant="bodyS">
                        Pick a date for this session
                      </Typography>
                      <DesktopDatePicker
                        onChange={(newValue) => {
                          if (newValue !== null) handleDateChange(newValue);
                        }}
                        shouldDisableDate={(date: Dayjs) =>
                          !isDateInRange(
                            date,
                            eventData?.startTime,
                            eventData?.endTime,
                          )
                        }
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                        slotProps={{
                          popper: {
                            sx: {
                              ...{
                                '& .MuiPickersDay-root': { color: 'black' },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#D7FFC4',
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                  color: 'black',
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing="20px">
                      <Stack spacing="10px" flex={1}>
                        <Typography variant="bodyBB">Start Time</Typography>
                        <DesktopTimePicker
                          value={sessionStartTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) {
                              const combined = dayjs(sessionDate)
                                .set('hour', newValue.hour())
                                .set('minute', newValue.minute());
                              setSessionStartTime(combined);
                            }
                          }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#313131',
                              borderRadius: '10px',
                            },
                          }}
                          slotProps={{
                            field: {
                              readOnly: true,
                            },
                            popper: {
                              sx: {
                                ...{
                                  '& .MuiPickersDay-root': { color: 'black' },
                                  '& .MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: '#D7FFC4',
                                  },
                                  '& .MuiPickersCalendarHeader-root': {
                                    color: 'black',
                                  },
                                  '& .MuiMultiSectionDigitalClock-root': {
                                    color: 'black',
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                      <Stack spacing="10px" flex={1}>
                        <Typography variant="bodyBB">End Time</Typography>
                        <DesktopTimePicker
                          value={sessionEndTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) {
                              const combined = dayjs(sessionDate)
                                .set('hour', newValue.hour())
                                .set('minute', newValue.minute());
                              setSessionEndTime(combined);
                            }
                          }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#313131',
                              borderRadius: '10px',
                            },
                          }}
                          slotProps={{
                            field: {
                              readOnly: true,
                            },
                            popper: {
                              sx: {
                                ...{
                                  '& .MuiPickersDay-root': { color: 'black' },
                                  '& .MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: '#D7FFC4',
                                  },
                                  '& .MuiPickersCalendarHeader-root': {
                                    color: 'black',
                                  },
                                  '& .MuiMultiSectionDigitalClock-root': {
                                    color: 'black',
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                  {sessionLocation &&
                    sessionDate &&
                    sessionStartTime !==
                      dayjs().set('hour', 0).set('minute', 0) &&
                    sessionEndTime !==
                      dayjs().set('hour', 0).set('minute', 0) && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          spacing="10px"
                          padding="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          borderRadius="10px"
                        >
                          <Typography variant="caption">
                            Date & times your are booking:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            spacing="10px"
                          >
                            <Typography variant="bodyBB">
                              {`${sessionDate.format('MMMM')}` +
                                ' ' +
                                `${sessionDate.format('DD')}` +
                                ', ' +
                                `${sessionDate.format('YYYY')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              Start Time:{' '}
                              {`${sessionStartTime.format('hh:mm A')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              End Time: :{' '}
                              {`${sessionEndTime.format('hh:mm A')}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                </Stack>
              )}
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Session Participants</Typography>
              <Stack direction={'row'} spacing="10px">
                <ZuSwitch
                  checked={hiddenOrganizer}
                  onChange={() => setHiddenOrganizer((v) => !v)}
                />
                <Stack spacing="10px">
                  <Typography variant="bodyBB">
                    Hide yourself as an organizer for this session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    By default the creator of a session is listed as an
                    organizer of it
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Organizers*</Typography>
                  <Typography variant="bodyS">
                    Type or search a person
                  </Typography>
                </Stack>
                <SelectSearchUser
                  users={people}
                  onChange={handleOrganizerChange}
                  initialUsers={[profile as Profile]}
                  removedInitialUsers={hiddenOrganizer}
                />
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Speakers</Typography>
                  <Typography variant="bodyS">
                    Type or search a person
                  </Typography>
                </Stack>
                <SelectSearchUser
                  users={people}
                  onChange={handleSpeakerChange}
                />
              </Stack>
            </Stack>
            <Box
              display="flex"
              gap="20px"
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <ZuButton
                sx={{
                  flex: 1,
                  width: isMobile ? '100%' : 'auto',
                }}
                startIcon={<XMarkIcon />}
                onClick={() => toggleDrawer('right', false)}
              >
                Discard
              </ZuButton>
              <ZuButton
                sx={{
                  color: '#67DBFF',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                  flex: 1,
                  width: isMobile ? '100%' : 'auto',
                }}
                startIcon={<PlusCircleIcon color="#67DBFF" />}
                onClick={createSession}
              >
                Add Session
              </ZuButton>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack padding="20px" bgcolor="#222222" height="auto">
        {!selectedSession ? (
          <Grid container spacing="30px">
            {isMobile && (
              <Grid item xs={12}>
                <Stack spacing="20px">
                  <OutlinedInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Sessions"
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
                  <ZuButton
                    startIcon={<PlusCircleIcon />}
                    sx={{ width: '100%' }}
                    onClick={() => toggleDrawer('right', true)}
                  >
                    Add a Session
                  </ZuButton>
                  <Stack spacing="15px">
                    <Stack
                      padding="10px"
                      borderRadius="10px"
                      bgcolor="#2d2d2d"
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
                      borderRadius="10px"
                      bgcolor="#2d2d2d"
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
                  <ZuCalendar
                    value={selectedDate}
                    onChange={(val) => {
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
                    onMonthChange={(val) => setDateForCalendar(val)}
                    onYearChange={(val) => setDateForCalendar(val)}
                  />
                </Stack>
              </Grid>
            )}
            <Grid item xs={12} md={8}>
              <Stack
                borderRadius="10px"
                border="1px solid #383838"
                bgcolor="#262626"
                flex={8}
              >
                <Stack
                  sx={{
                    borderTopRightRadius: '10px',
                    borderTopLeftRadius: '10px',
                  }}
                  paddingX="10px"
                  direction="row"
                >
                  <Stack
                    direction="row"
                    spacing="10px"
                    padding="14px"
                    sx={{ cursor: 'pointer' }}
                    alignItems="center"
                  >
                    <QueueListIcon size={5} />
                    <ZuButton
                      onClick={() => {
                        setSelectedDate(null);
                      }}
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        padding: 0,
                        minWidth: 'auto',
                      }}
                    >
                      <Typography variant="bodyS">Full Schedule</Typography>
                    </ZuButton>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="10px"
                    padding="14px"
                    sx={{ cursor: 'pointer' }}
                    alignItems="center"
                  >
                    <ChevronDoubleRightIcon size={5} />
                    <ZuButton
                      onClick={() => {
                        setSelectedDate(dayjs().tz(eventData?.timezone));
                      }}
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        padding: 0,
                        minWidth: 'auto',
                      }}
                    >
                      <Typography variant="bodyS">
                        Today{' '}
                        {dayjs().tz(eventData?.timezone).format('DD MMM YYYY')}
                      </Typography>
                    </ZuButton>
                  </Stack>
                </Stack>
                {loading ? (
                  <Stack
                    borderRadius="10px"
                    border="1px solid #383838"
                    bgcolor="#262626"
                    flex={8}
                  >
                    <Typography variant="bodyS">Loading...</Typography>
                  </Stack>
                ) : sessionsByDate &&
                  Object.keys(sessionsByDate).length !== 0 ? (
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
                      >
                        <Typography
                          borderTop="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                          padding="8px 10px"
                          variant="bodySB"
                          bgcolor="rgba(255, 255, 255, 0.05)"
                          borderRadius="10px"
                          sx={{ opacity: 0.6 }}
                        >
                          {dayjs(date, 'MMMM D, YYYY')
                            .tz(eventData?.timezone)
                            .format('dddd · DD MMM YYYY')}
                        </Typography>
                        {dateSessions && dateSessions.length > 0 ? (
                          dateSessions.map((session, index) => (
                            <SessionCard
                              key={`SessionCard-${index}`}
                              session={session}
                              eventId={eventId}
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
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={4}>
                <Stack spacing="20px">
                  <Stack
                    sx={{
                      flexDirection: 'column',
                      gap: '10px',
                      [theme.breakpoints.down('md')]: {
                        display: 'flex',
                      },
                    }}
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
                  </Stack>
                  <ZuButton
                    startIcon={<PlusCircleIcon />}
                    sx={{ width: '100%' }}
                    onClick={() => toggleDrawer('right', true)}
                  >
                    Add a Session
                  </ZuButton>
                  <Stack spacing="15px">
                    <Stack
                      padding="10px"
                      borderRadius="10px"
                      bgcolor="#2d2d2d"
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
                      borderRadius="10px"
                      bgcolor="#2d2d2d"
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
                  <ZuCalendar
                    value={selectedDate}
                    onChange={(val) => {
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
                    onMonthChange={(val) => setDateForCalendar(val)}
                    onYearChange={(val) => setDateForCalendar(val)}
                  />
                </Stack>
              </Grid>
            )}
          </Grid>
        ) : null}
        {!isMobile ? (
          <SwipeableDrawer
            hideBackdrop={true}
            sx={{
              position: 'relative',
              zIndex: 3,
              '& .MuiDrawer-paper': {
                marginTop: '50px',
                height: 'calc(100% - 50px)',
                boxShadow: 'none',
                backgroundColor: 'transparent',
                paddingLeft: '80px', // WARNING:!! Leave space for editorjs to operate, DONT DELETE
              },
            }}
            anchor="right"
            open={state['right']}
            onClose={() => toggleDrawer('right', false)}
            onOpen={() => toggleDrawer('right', true)}
          >
            {List('right')}
          </SwipeableDrawer>
        ) : state.right ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 100,
            }}
          >
            {List('right')}
          </Box>
        ) : null}
      </Stack>
    </LocalizationProvider>
  );
};

export default Sessions;
