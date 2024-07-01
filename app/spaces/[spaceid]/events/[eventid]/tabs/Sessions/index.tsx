'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Grid, Typography, SwipeableDrawer, Divider, Box, Select, OutlinedInput, MenuItem, Chip, InputAdornment, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeView } from '@mui/x-date-pickers/models';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import { ZuInput, ZuButton, ZuSwitch, ZuCalendar } from '@/components/core';
import TextEditor from '@/components/editor/editor';
import { OutputData } from '@editorjs/editorjs';
import { PlusCircleIcon, LockIcon, XMarkIcon, ArchiveBoxIcon, ArrowDownIcon, ChevronDownIcon, SearchIcon, FingerPrintIcon, UserPlusIcon, EditIcon, QueueListIcon, ChevronDoubleRightIcon } from '@/components/icons';
import SessionCard from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Sessions/components/SessionList/SessionCard';
import BpCheckbox from '@/components/event/Checkbox';
import { Anchor, Session, SessionData, ProfileEdge, Profile, CeramicResponseType, EventEdge, Venue, Event } from '@/types';
import { SPACE_CATEGORIES, EXPREIENCE_LEVEL_TYPES } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { supabase } from '@/utils/supabase/client';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

interface ISessions {
  eventData: Event | undefined;
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);


const Sessions: React.FC<ISessions> = ({ eventData }) => {
  const theme = useTheme();
  const { composeClient, isAuthenticated, profile } = useCeramicContext();

  const params = useParams();
  const eventId = params.eventid.toString();
  const profileId = profile?.id || '';

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    ),
  );
  const [sessionsByDate, setSessionsByDate] = useState<Record<string, Session[]>>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionTrack, setSessionTrack] = useState<string>('');
  const [sessionTags, setSessionTags] = useState<Array<string>>([]);
  const [sessionDescription, setSessionDescription] = useState<OutputData>();
  const [sessionType, setSessionType] = useState<string>('');
  const [sessoinStatus, setSessionStatus] = useState<string>('');
  const [sessionGated, setSessionGated] = useState<string>('');
  const [sessionExperienceLevel, setSessionExperienceLevel] = useState<string>('');
  // const [sessionFormat, setSessionFormat] = useState<string>("");
  const [sessionVideoURL, setSessionVideoURL] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<Dayjs | null>(dayjs());
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs>(
    dayjs().set('hour', 0).set('minute', 0)
  );
  const [sessionEndTime, setSessionEndTime] = useState<Dayjs>(dayjs().set('hour', 0).set('minute', 0));
  const [sessionOrganizers, setSessionOrganizers] = useState<Array<any>>([]);
  const [organizers, setOrganizers] = useState<Array<string>>([]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<any>>([]);
  const [speakers, setSpeakers] = useState<Array<string>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>();
  const [sessionLiveStreamLink, setSessionLiveStreamLink] = useState<string>("");

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const groupSessionByDate = (sessions: Session[]): Record<string, Session[]> => {
    return sessions.reduce((acc, session) => {
      const formattedDate = dayjs(session.startTime).format('MMMM D, YYYY');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }

  const getSession = async () => {
    try {
      const { data } = await supabase.from('sessions').select('*').eq('eventId', eventId);
      if (data) {
        setSessions(data);
        const sessionsbydate = groupSessionByDate(data);
        console.log("data", sessionsbydate)
        setSessionsByDate(sessionsbydate);
      }
    } catch (err) {
      console.log(err)
    }
  }

  console.log("sessions", sessions)

  const handleDateChange = (date: Dayjs) => {
    if (date) {
      const dayName = date.format('dddd'); // Get the day name (e.g., 'Monday')
      const available = JSON.parse(venues.filter(item => item.name === sessionLocation)[0].bookings)
      setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
    }
    setSessionDate(date);
  };

  const isDateInRange = (date: Dayjs, startDate?: string, endDate?: string): boolean => {
    return date.isAfter(dayjs(startDate).subtract(1, 'day')) && date.isBefore(dayjs(endDate).add(1, 'day'));
  };

  const isTimeAvailable = (date: Dayjs, available?: any): boolean => {
    const formattedTime = date.format('HH:mm');
    const isMinuteIntervalValid = date.minute() % 30 === 0;
    const isWithinAvailableSlot = availableTimeSlots.some((slot: any) => {
      const startTime = dayjs(slot.startTime).format('HH:mm');
      const endTime = dayjs(slot.endTime).format('HH:mm');
      return formattedTime >= startTime && formattedTime < endTime;
    }
    );

    return isMinuteIntervalValid && isWithinAvailableSlot;
  };

  const getPeople = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          mVPProfileIndex(first: 20) {
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
  }

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('venues')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setVenues(data);
        const locations = data.map(item => item.name);
        setLocations(locations);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const handleChange = (e: any) => {
    setSessionTags(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const handleSpeakerChange = (e: any) => {
    setSpeakers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );

    const speakers = e.target.value.map((speaker: any) => people.filter(i => i.username === speaker)[0]);
    setSessionSpeakers(speakers);
  }

  const handleOrganizerChange = (e: any) => {
    setOrganizers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
    const organizers = e.target.value.map((organizer: any) => people.filter(i => i.username === organizer)[0]);
    setSessionOrganizers(organizers);
  }
  const createSession = async () => {
    if (!isAuthenticated) {
      return;
    }

    let strDesc: any = JSON.stringify(sessionDescription);

    strDesc = strDesc.replaceAll('"', '\\"');

    const error = !eventId || !sessionStartTime || !sessionEndTime || !sessionName || !sessionTags || !sessionTrack || !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert(
          'Please fill necessary fields!',
        );
      return;
    }

    const format = person ? 'person' : 'online';

    const { data } = await supabase.from('sessions').insert({
      title: sessionName,
      description: strDesc,
      experience_level: sessionExperienceLevel,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      startTime: sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      endTime: sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      profileId,
      eventId,
      tags: sessionTags.join(','),
      type: sessionType,
      format,
      track: sessionTrack,
      timezone: dayjs.tz.guess().toString(),
      video_url: sessionVideoURL,
      location: sessionLocation,
      organizers: JSON.stringify(sessionOrganizers),
      speakers: JSON.stringify(sessionSpeakers)
    })

    toggleDrawer('right', false);
    await getSession();

  };

  useEffect(() => {
    const fetchData = async () => {
      await getSession();
      await getPeople();
      await getLocation();
    }

    fetchData();
  }, [])

  const List = (anchor: Anchor) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
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
              <ZuButton
                startIcon={<ArchiveBoxIcon size={5} />}
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Save Draft
              </ZuButton>
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
                  placeholder="Standard Pass"
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
                <Box>
                  <Select
                    multiple
                    value={sessionTags}
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                  >
                    {SPACE_CATEGORIES.map((tag, index) => {
                      return (
                        <MenuItem value={tag.value} key={index}>
                          {tag.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  gap={'10px'}
                  flexWrap={'wrap'}
                >
                  {sessionTags.map((tag, index) => {
                    return (
                      <Chip
                        label={
                          SPACE_CATEGORIES.find((item) => item.value === tag)
                            ?.label
                        }
                        sx={{
                          borderRadius: '10px',
                        }}
                        onDelete={() => {
                          const newArray = sessionTags.filter(
                            (item) => item !== tag,
                          );
                          setSessionTags(newArray);
                        }}
                        key={index}
                      />
                    );
                  })}
                </Box>
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Description*</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Write an introduction for this session
                </Typography>
                <TextEditor
                  holder="session_description"
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    height: 'auto',
                    minHeight: '270px',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                  }}
                  setData={setSessionDescription}
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
                      <MenuItem
                        value={i.key}
                        key={`Speaker_Index${index}`}
                      >
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
                  >
                    <BpCheckbox
                      checked={person}
                      onChange={() => {
                        setPerson((prev) => !prev);
                        setOnline((prev) => !prev);
                      }}
                    />
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
                  >
                    <BpCheckbox
                      checked={online}
                      onChange={() => {
                        setPerson((prev) => !prev);
                        setOnline((prev) => !prev);
                      }}
                    />
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
                      onChange={(e) => setSessionLocation(e.target.value)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#222222',
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
                    </Select>
                    {sessionLocation && (
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
                              src="/20.png"
                            />
                            <Stack spacing="4px">
                              <Typography variant="bodyBB">
                                {sessionLocation}
                              </Typography>
                              <Typography variant="bodyS">
                                Sessions booked: 22
                              </Typography>
                              <Typography variant="caption">
                                Capacity: 15
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <Typography variant="bodyBB">Book a Date*</Typography>
                      <Typography variant="bodyS">
                        View and select the available dates and times for this
                        location
                      </Typography>
                      <DatePicker
                        onChange={(newValue) => { if (newValue !== null) handleDateChange(newValue) }}
                        shouldDisableDate={(date: Dayjs) => !isDateInRange(date, eventData?.startTime, eventData?.endTime)}
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
                              const combined = dayjs(sessionDate).set("hour", newValue.hour()).set("minute", newValue.minute());
                              setSessionStartTime(combined)
                            }
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
                              return !isTimeAvailable(date);
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
                              const combined = dayjs(sessionDate).set("hour", newValue.hour()).set("minute", newValue.minute());
                              setSessionEndTime(combined);
                            }
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
                              return !isTimeAvailable(date);
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
                    {sessionDate && sessionStartTime !== dayjs().set('hour', 0).set('minute', 0) && sessionEndTime !== dayjs().set('hour', 0).set('minute', 0) && (
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
                              {`${sessionStartTime.format('HH')}` +
                                `${sessionStartTime.format('A')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              End Time: :{' '}
                              {`${sessionEndTime.format('HH')}` +
                                `${sessionEndTime.format('A')}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
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
                        onChange={(newValue) => { if (newValue !== null) handleDateChange(newValue) }}
                        shouldDisableDate={(date: Dayjs) => !isDateInRange(date, eventData?.startTime, eventData?.endTime)}
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
                              const combined = dayjs(sessionDate).set("hour", newValue.hour()).set("minute", newValue.minute());
                              setSessionStartTime(combined)
                            }
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
                              return !isTimeAvailable(date);
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
                              const combined = dayjs(sessionDate).set("hour", newValue.hour()).set("minute", newValue.minute());
                              setSessionEndTime(combined)
                            }
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
                              return !isTimeAvailable(date);
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
                <Box>
                  <Select
                    multiple
                    value={organizers}
                    style={{ width: '100%' }}
                    onChange={handleOrganizerChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                  >
                    {people.map((i, index) => {
                      return (
                        <MenuItem
                          value={i.username}
                          key={`Organizer_Index${index}`}
                        >
                          {i.username}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  gap={'10px'}
                  flexWrap={'wrap'}
                >
                  {organizers.map((i, index) => {
                    return (
                      <Chip
                        label={i}
                        sx={{
                          borderRadius: '10px',
                        }}
                        onDelete={() => {
                          const newArray = organizers
                            .filter((item) => item !== i)
                          setOrganizers(newArray);
                          const newDIDs = sessionOrganizers.filter((_, ind) => ind !== index);
                          setSessionOrganizers(newDIDs);
                        }}
                        key={`Selected_Organizerr${index}`}
                      />
                    );
                  })}
                </Box>
              </Stack>
              {/* <Stack spacing="20px">
                <Stack
                  pt="20px"
                  borderTop="1px solid rgba(255, 255, 255, 0.10)"
                >
                  <ZuButton
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                    endIcon={<ChevronDownIcon size={4} />}
                  >
                    Hide Advanced Settings
                  </ZuButton>
                </Stack>
                <Stack direction="row" spacing="10px">
                  <ZuSwitch />
                  <Stack spacing="10px">
                    <Typography variant="bodyBB">
                      Hide yourself as an organizer for this session
                    </Typography>
                    <Typography variant="bodyS">
                      By default the creator of a session is listed as an
                      organizer of it
                    </Typography>
                  </Stack>
                </Stack>
              </Stack> */}
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Speakers</Typography>
                  <Typography variant="bodyS">
                    Type or search a person
                  </Typography>
                </Stack>
                <Box>
                  <Select
                    multiple
                    value={speakers}
                    style={{ width: '100%' }}
                    onChange={handleSpeakerChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                  >
                    {people.map((i, index) => {
                      return (
                        <MenuItem
                          value={i.username}
                          key={`Speaker_Index${index}`}
                        >
                          {i.username}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  gap={'10px'}
                  flexWrap={'wrap'}
                >
                  {speakers.map((i, index) => {
                    return (
                      <Chip
                        label={i}
                        sx={{
                          borderRadius: '10px',
                        }}
                        onDelete={() => {
                          const newArray = speakers
                            .filter((item) => item !== i)
                          setSpeakers(newArray);
                          const newDIDs = sessionSpeakers.filter((_, ind) => ind !== index);
                          setSessionSpeakers(newDIDs);
                        }}
                        key={`Selected_Speaker${index}`}
                      />
                    );
                  })}
                </Box>
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
      <Stack padding="20px 80px" bgcolor="#222222" height="100vh">
        <Grid container spacing="30px">
          <Grid item xs={12} md={8}>
            <Stack borderRadius="10px" border="1px solid #383838" bgcolor="#262626" flex={8}>
              <Stack sx={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }} paddingX="10px" direction="row">
                <Stack direction="row" spacing="10px" padding="14px" sx={{ cursor: "pointer" }} alignItems="center">
                  <QueueListIcon size={5} />
                  <Typography variant="bodyS">
                    Full Schedule
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px" padding="14px" sx={{ cursor: "pointer" }} alignItems="center">
                  <ChevronDoubleRightIcon size={5} />
                  <Typography variant="bodyS">
                    Today
                  </Typography>
                </Stack>
              </Stack>
              {
                sessionsByDate ? Object.entries(sessionsByDate).map(([date, dateSessions]) => (
                  <Stack spacing="10px" padding="10px" key={`Sesssion-GroupByDate-${date}`}>
                    <Typography
                      borderTop="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                      padding="8px 10px" variant="bodySB" bgcolor="rgba(255, 255, 255, 0.05)"
                      borderRadius="10px" sx={{ opacity: 0.6 }}>
                      {date}
                    </Typography>
                    {
                      dateSessions.map((session, index) => (
                        <SessionCard
                          key={`SessionCard-${index}`}
                          session={session}
                        />))
                    }
                  </Stack>
                )) :
                  <Stack
                    direction="column"
                    alignItems="center"
                    bgcolor="#2d2d2d"
                    padding="20px"
                    borderRadius="10px"
                    sx={{ cursor: "pointer" }}
                  >
                    <PlusCircleIcon color="#6c6c6c" size={15} />
                    <Typography variant="subtitle2">No Sessions</Typography>
                    <Typography variant="body2">Create a Session</Typography>
                  </Stack>
              }
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
                    backgroundColor:
                      '#313131',
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
              <ZuButton startIcon={<LockIcon />} sx={{ width: "100%" }}
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
                <ZuInput placeholder="Location" />
                <ZuInput placeholder="Track" />
                <Stack padding="10px" borderRadius="10px" bgcolor="#2d2d2d" direction="row" alignItems="center" spacing="10px">
                  <UserPlusIcon />
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    My RSVPs
                  </Typography>
                  <Stack flex={1} direction='row' justifyContent="end">
                    <ZuSwitch />
                  </Stack>
                </Stack>
                <Stack padding="10px" borderRadius="10px" bgcolor="#2d2d2d" direction="row" alignItems="center" spacing="10px">
                  <EditIcon />
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Managed by me
                  </Typography>
                  <Stack flex={1} direction='row' justifyContent="end">
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
                    highlightedDays: sessions.map(
                      (session) => {
                        return new Date(session.startTime).getDate();
                      },
                    ),
                  } as any,
                }}
              // onMonthChange={(val) => handleMonthChange(val)}
              />
            </Stack>
          </Grid>
        </Grid>
        <SwipeableDrawer
          hideBackdrop={true}
          sx={{
            '& .MuiDrawer-paper': {
              marginTop: '50px',
              height: 'calc(100% - 50px)',
              boxShadow: 'none',
            },
          }}
          anchor="right"
          open={state['right']}
          onClose={() => toggleDrawer('right', false)}
          onOpen={() => toggleDrawer('right', true)}
        >
          {
            List('right')
          }
        </SwipeableDrawer>
      </Stack>
    </LocalizationProvider>
  )
}

export default Sessions;