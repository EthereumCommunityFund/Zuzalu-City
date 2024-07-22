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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

interface ISessions {
  eventData: Event | undefined;
}

const Sessions: React.FC<ISessions> = ({ eventData }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();

  const params = useParams();
  const eventId = params.eventid.toString();
  const profileId = profile?.id || '';
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
  const [showMore, setShowMore] = useState(false);
  const [isContentLarge, setIsContentLarge] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRsvped, setIsRsvped] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    ),
  );

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
  const [sessoinStatus, setSessionStatus] = useState<string>('');
  const [sessionGated, setSessionGated] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
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
  const [organizers, setOrganizers] = useState<Array<string>>([]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<any>>([]);
  const [speakers, setSpeakers] = useState<Array<string>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>('');
  const [sessionLiveStreamLink, setSessionLiveStreamLink] =
    useState<string>('');
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [locationAvatar, setLocationAvatar] = useState<string>('');
  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };
  const router = useRouter();
  const groupSessionByDate = (
    sessions: Session[],
  ): Record<string, Session[]> => {
    return sessions.reduce(
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
  };

  const getSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('eventId', eventId);
      if (data) {
        setSessions(data);
        const sessionsbydate = groupSessionByDate(data);
        setSessionsByDate(sessionsbydate);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
    if (sessionDate == null) return true;
    const formattedTime = date.format('HH:mm');
    const isWithinBookedSession = bookedSessionsForDay.some((session) => {
      const sessionStartTime = dayjs(session.startTime)
        .tz('UTC')
        .tz(eventData?.timezone)
        .format('HH:mm');
      const sessionEndTime = dayjs(session.endTime)
        .tz('UTC')
        .tz(eventData?.timezone)
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
          .tz(eventData?.timezone)
          .format('HH:mm');
        const endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(eventData?.timezone)
          .format('HH:mm');
        if (endTime >= startTime) {
          return formattedTime >= startTime && formattedTime < endTime;
        } else {
          return !(formattedTime < startTime && formattedTime >= endTime);
        }
      } else {
        startTime = sessionStartTime.tz(eventData?.timezone).format('HH:mm');
        endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(eventData?.timezone)
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

    for (let session of bookedSessions) {
      const sessionStart = dayjs(session.startTime)
        .tz('UTC')
        .tz(eventData?.timezone);
      const sessionEnd = dayjs(session.endTime)
        .tz('UTC')
        .tz(eventData?.timezone);

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

    const error =
      !eventId ||
      !sessionStartTime ||
      !sessionEndTime ||
      !sessionName ||
      !sessionTrack ||
      !sessionOrganizers;
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
        dayjs(sessionStartTime).tz('UTC').tz(eventData?.timezone),
        dayjs(sessionEndTime).tz('UTC').tz(eventData?.timezone),
      )
    ) {
      typeof window !== 'undefined' &&
        window.alert('The new session overlaps with an existing session');
      return;
    }

    const format = person ? 'person' : 'online';

    const formattedData: SessionSupabaseData = {
      title: sessionName,
      description: sessionDescriptionEditorStore.getValueString(),
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
      timezone: eventData?.timezone,
      video_url: sessionVideoURL,
      location:
        sessionLocation === 'Custom'
          ? `Custom Location: ${customLocation} ${directions}`
          : sessionLocation,
      organizers: JSON.stringify(sessionOrganizers),
      speakers: JSON.stringify(sessionSpeakers),
      creatorDID: adminId,
    };
    try {
      setBlockClickModal(true);
      const response = await supaCreateSession(formattedData);
      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
      toggleDrawer('right', false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSession();
      await getPeople();
      await getLocation();
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
  useEffect(() => {
    const contentHeight = contentRef.current?.scrollHeight ?? 0;
    setIsContentLarge(contentHeight > 300);
  }, [selectedSession?.description]);

  const List = (anchor: Anchor) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          title="Session Created"
          message="Please view it."
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            getSession();
            toggleDrawer('right', false);
          }}
          onConfirm={() => {
            setShowModal(false);
            getSession();
            toggleDrawer('right', false);
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
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '762px',
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
              <ZuButton onClick={() => toggleDrawer('right', true)}>
                <Typography variant="subtitleMB">Create a Session</Typography>
              </ZuButton>
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
                  <Typography variant="bodyBB">Session Tags*</Typography>
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
                <Box display="flex" justifyContent="space-between" gap="20px">
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
                        <DatePicker
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
                            <TimePicker
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
                            <TimePicker
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
                      <DatePicker
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
                        <TimePicker
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
                        <TimePicker
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
            <Box display="flex" gap="20px">
              <ZuButton
                sx={{
                  flex: 1,
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
                    <Typography variant="bodyS">Full Schedule</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="10px"
                    padding="14px"
                    sx={{ cursor: 'pointer' }}
                    alignItems="center"
                  >
                    <ChevronDoubleRightIcon size={5} />
                    <Typography variant="bodyS">Today</Typography>
                  </Stack>
                </Stack>
                {sessionsByDate && Object.keys(sessionsByDate).length !== 0 ? (
                  Object.entries(sessionsByDate).map(([date, dateSessions]) => (
                    <Stack
                      spacing="10px"
                      padding="10px"
                      key={`Sesssion-GroupByDate-${date}`}
                    >
                      <Typography
                        borderTop="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                        padding="8px 10px"
                        variant="bodySB"
                        bgcolor="rgba(255, 255, 255, 0.05)"
                        borderRadius="10px"
                        sx={{ opacity: 0.6 }}
                      >
                        {date}
                      </Typography>
                      {dateSessions.map((session, index) => (
                        <SessionCard
                          key={`SessionCard-${index}`}
                          session={session}
                          setSelectedSession={setSelectedSession}
                          setIsRsvped={setIsRsvped}
                          userDID={adminId}
                          setShowDeleteButton={setShowDeleteButton}
                          setLocationAvatar={setLocationAvatar}
                        />
                      ))}
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
                      <Typography variant="body2">Create a Session</Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Grid>
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
                {/* <Stack borderRadius="10px" border="1px solid #383838" bgcolor="#262626" padding="10px" flex={4} spacing="10px">
                <Stack pb="20px" borderBottom="1px solid #383838">
                  <ZuButton startIcon={<LockIcon />} sx={{ width: "100%" }}
                    onClick={() => toggleDrawer('right', true)}
                  >
                    Add a Session
                  </ZuButton>
                </Stack>
                <Stack spacing="5px">
                  <Typography variant="bodyMB">
                    Gated For:
                  </Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                    Need at least one of the following credentials:
                  </Typography>
                </Stack>
                <ZuButton>
                  ZuVillage Attendee
                </ZuButton>
                <ZuButton startIcon={<FingerPrintIcon />} sx={{ width: "100%" }} variant='outlined'>
                  Verify
                </ZuButton>
              </Stack> */}
                <Stack spacing="15px">
                  {/*<ZuInput placeholder="Location" />
                  <ZuInput placeholder="Track" />*/}
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
                      <ZuSwitch />
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
                      <ZuSwitch />
                    </Stack>
                  </Stack>
                </Stack>
                <ZuCalendar
                  value={selectedDate}
                  onChange={(val) => {
                    setSelectedDate(val);
                  }}
                  // slots={{
                  //   day: SlotDates,
                  // }}
                  slotProps={{
                    day: {
                      highlightedDays: sessions.map((session) => {
                        return new Date(session.startTime).getDate();
                      }),
                    } as any,
                  }}
                  // onMonthChange={(val) => handleMonthChange(val)}
                />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Stack
            direction={isTablet ? 'column' : 'row'}
            gap="20px"
            justifyContent="center"
          >
            <Stack
              borderRadius="10px"
              border="1px solid #383838"
              bgcolor="#262626"
              width="600px"
            >
              <Stack padding="10px">
                <ZuButton
                  startIcon={<LeftArrowIcon />}
                  onClick={() => {
                    setSelectedSession(undefined);
                    setIsRsvped(false);
                    setShowDeleteButton(false);
                    getSession();
                  }}
                >
                  Back to List
                </ZuButton>
              </Stack>
              <Stack padding="20px" spacing="20px">
                <Stack spacing="10px">
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
                    {selectedSession.format === 'online' ? (
                      <Link
                        href={selectedSession.video_url || ''}
                        target="_blank"
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography
                          variant="bodyM"
                          color="white"
                          sx={{ opacity: 0.5, wordBreak: 'break-all' }}
                        >
                          {selectedSession.video_url}
                        </Typography>
                      </Link>
                    ) : (
                      <>
                        <MapIcon size={4} />
                        <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                          {selectedSession.location}
                        </Typography>
                      </>
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
                      <ZuButton
                        variant="contained"
                        color="primary"
                        onClick={() => handleRSVPClick(selectedSession.id)}
                      >
                        <Typography variant="bodyBB"> RSVP Session </Typography>
                      </ZuButton>
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
              <Stack spacing="20px" padding="20px">
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
              <Stack padding="20px" spacing="20px">
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
            <Stack spacing="20px" width="320px">
              <Stack padding="14px" borderBottom="1px solid #383838">
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
                      src={locationAvatar || '/26.png'}
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
      </Stack>
    </LocalizationProvider>
  );
};

export default Sessions;
