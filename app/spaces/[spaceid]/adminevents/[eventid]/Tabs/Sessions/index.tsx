import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import {
  Stack,
  Box,
  Typography,
  SwipeableDrawer,
  OutlinedInput,
  Select,
  Chip,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeView } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SessionHeader, SessionList } from './components';
import { ZuButton, ZuInput } from 'components/core';
import {
  XMarkIcon,
  PlusCircleIcon,
  ArrowDownIcon,
  PlusIcon,
  MinusIcon,
} from 'components/icons';
import TextEditor from 'components/editor/editor';
import BpCheckbox from '@/components/event/Checkbox';
import { useCeramicContext } from '@/context/CeramicContext';
import {
  Session,
  SessionData,
  Profile,
  ProfileEdge,
  Event,
  EventEdge,
  Anchor,
  CeramicResponseType,
  Venue,
} from '@/types';
import { OutputData } from '@editorjs/editorjs';
import { EXPREIENCE_LEVEL_TYPES } from '@/constant';
import { supabase } from '@/utils/supabase/client';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import SelectCheckItem from '@/components/select/selectCheckItem';
import SelectCategories from '@/components/select/selectCategories';
import ZuAutoCompleteInput from '@/components/input/ZuAutocompleteInput';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const Sessions = () => {
  const params = useParams();
  const [isChecked, setIsChecked] = React.useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [eventData, setEventData] = useState<Event>();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [total, setTotal] = useState<any[]>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session>();
  const [selectedRoom, setSelectedRoom] = useState<Venue>();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionTrack, setSessionTrack] = useState<string>('');
  const [sessionTags, setSessionTags] = useState<Array<{ value: string; label: string; }>>([]);
  const [sessionDescription, setSessionDescription] = useState<OutputData>();
  const [sessionType, setSessionType] = useState<string>('');
  const [sessoinStatus, setSessionStatus] = useState<string>('');
  const [sessionGated, setSessionGated] = useState<boolean>(false);
  const [sessionExperienceLevel, setSessionExperienceLevel] =
    useState<string>('');
  const [sessionLiveStreamLink, setSessionLiveStreamLink] =
    useState<string>('');
  const [sessionVideoURL, setSessionVideoURL] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<Dayjs | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<Dayjs | null>(null);
  const [sessionOrganizers, setSessionOrganizers] = useState<Array<string>>([]);
  const [organizers, setOrganizers] = useState<Array<string>>([]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<string>>([]);
  const [speakers, setSpeakers] = useState<Array<string>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>('');
  const [sessionTimezone, setSessionTimezone] = useState<string>('');

  const { composeClient, profile, isAuthenticated } = useCeramicContext();

  const [directions, setDirections] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isDirections, setIsDirections] = useState<boolean>(false);

  const profileId = profile?.id || '';
  const eventId = params.eventid.toString();

  const getSessions = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          sessionIndex(first: 20) {
            edges {
              node {
                id
                title
                createdAt
                profileId
                startTime
                endTime
                eventId
                tags
                type
                track
                format
                status
                timezone
                video_url
                description
                meeting_url
                experience_level
                speakers {
                  id
                  mvpProfile {
                    id
                    avatar
                    username
                  }
                }
                organizers {
                  id
                  mvpProfile {
                    id
                    avatar
                    username
                  }
                }
              }
            }
          }
        }
      `);
      if ('sessionIndex' in response.data) {
        const sessionData: SessionData = response.data as SessionData;
        const fetchedSessions: Session[] = sessionData.sessionIndex.edges.map(
          (edge) => edge.node,
        );
        setSessions(fetchedSessions);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sesssions:', error);
    }
  };

  const getPeople = async () => {
    // try {
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
    // } catch (error) {
    //   console.error('Failed to fetch sesssions:', error);
    // }
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

  const getSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('eventId', eventId);
      if (data) {
        setSessions(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRoom = venues.filter(
      (item) => item.name === e.target.value,
    )[0];
    setSelectedRoom(selectedRoom);
  };

  const handleDateChange = (date: Dayjs) => {
    if (date) {
      const dayName = date.format('dddd'); // Get the day name (e.g., 'Monday')
      const venue = venues.filter((item) => item.name === sessionLocation)[0];
      if (venue) {
        const available = JSON.parse(venue.bookings);
        setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
      }
    }
    setSessionDate(date);
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

  const isTimeAvailable = (date: Dayjs, isStartTime = true): boolean => {
    const isMinuteIntervalValid = date.minute() % 30 === 0;

    if (isStartTime) {
      if (!sessionEndTime) return isMinuteIntervalValid;
      return (
        isMinuteIntervalValid &&
        date.isBefore(dayjs(sessionEndTime).subtract(1, 'minute'))
      );
    }

    if (!sessionStartTime) return isMinuteIntervalValid;
    return (
      isMinuteIntervalValid &&
      date.isAfter(dayjs(sessionStartTime).add(1, 'minute'))
    );
  };

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on Event {
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
              tracks
              space {
                id
                name
                gated
                avatar
                banner
                description
              }
              profile {
                username  
                avatar
              }
            }
          }
        }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
      if (response.data) {
        if (response.data.node) {
          setEventData(response.data.node);
        }
      }
    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await getSessions();
        await getSession();
        await getPeople();
        await getLocation();
        await getEventDetailInfo();
      } catch (error) {
        console.error('An error occurred:', error);
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

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const handleChange = (value: string[]) => {
    setSessionTags(value);
  };

  const handleSpeakerChange = (e: any) => {
    setSpeakers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );

    const speakers = e.target.value.map(
      (speaker: any) =>
        people.filter((i) => i.username === speaker)[0].author?.id,
    );
    setSessionSpeakers(speakers);
  };

  const handleOrganizerChange = (e: any) => {
    setOrganizers(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );

    const organizers = e.target.value.map(
      (organizer: any) =>
        people.filter((i) => i.username === organizer)[0].author?.id,
    );
    setSessionOrganizers(organizers);
  };

  const createSession = async () => {
    if (!isAuthenticated) {
      return;
    }
    let strDesc: any = JSON.stringify(sessionDescription);

    strDesc = strDesc.replaceAll('"', '\\"');
    const error =
      !eventId ||
      !sessionDate ||
      !sessionStartTime ||
      !sessionEndTime ||
      !sessionName ||
      !sessionTags ||
      !sessionTrack ||
      !sessionDescription ||
      !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert('Please fill necessary fields!');
      return;
    }

    const format = person ? 'person' : 'online';

    const result = await supabase.from('sessions').insert({
      title: sessionName,
      description: strDesc,
      experience_level: sessionExperienceLevel,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      startTime: sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      endTime: sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      profileId,
      eventId,
      tags: sessionTags.map((item) => item.label).join(','),
      type: sessionType,
      status: sessoinStatus,
      format,
      track: sessionTrack,
      gated: sessionGated,
      timezone: dayjs.tz.guess().toString(),
      video_url: sessionVideoURL,
    });

    toggleDrawer('right', false);
    await getSession();
  };

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
            sx={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#222222',
              zIndex: 10,
            }}
          >
            <ZuButton
              startIcon={<XMarkIcon size={5} />}
              onClick={() => toggleDrawer('right', false)}
              sx={{
                backgroundColor: 'transparent',
                fontWeight: 'bold',
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
              <FormTitle>Create a Session</FormTitle>
              {/*<ZuButton*/}
              {/*  startIcon={<ArchiveBoxIcon size={5} />}*/}
              {/*  sx={{*/}
              {/*    fontSize: '14px',*/}
              {/*    fontWeight: 600,*/}
              {/*    paddingLeft: '12px',*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Save Draft*/}
              {/*</ZuButton>*/}
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <FormTitle>Session Details</FormTitle>
              <Stack spacing="10px">
                <FormLabel>Session Name*</FormLabel>
                <ZuInput
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Standard Pass"
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Select a Track*</FormLabel>
                <FormLabelDesc>
                  Attach a relevant track this session relates to
                </FormLabelDesc>
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
                  <FormLabel>Session Tags</FormLabel>
                  <FormLabelDesc>
                    Search or create categories related to your space
                  </FormLabelDesc>
                </Stack>
                <ZuAutoCompleteInput
                  optionVals={SPACE_CATEGORIES}
                  val={sessionTags}
                  setVal={setSessionTags}
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Session Description*</FormLabel>
                <FormLabelDesc>
                  Write an introduction for this session
                </FormLabelDesc>
                <TextEditor
                  holder="session_description"
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    height: 'auto',
                    minHeight: '270px',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                  }}
                  setData={setSessionDescription}
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Session Type</FormLabel>
                <FormLabelDesc>
                  Choose a type for your session to relay its nature to guests
                </FormLabelDesc>
                <ZuInput
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="Meetup, Activity, Party, etc.."
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Experience Level</FormLabel>
                <FormLabelDesc>
                  Select a level experience may be needed for this session
                </FormLabelDesc>
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
                <FormLabel>Live-Stream Link</FormLabel>
                <FormLabelDesc>
                  Enter a link for where this session will be streamed
                </FormLabelDesc>
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
              <FormTitle>Location & Booking</FormTitle>
              <Stack spacing="10px">
                <FormLabel>Session Format*</FormLabel>
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
                    <FormLabel>Select Location*</FormLabel>
                    <FormLabelDesc>
                      Book a location to host this session
                    </FormLabelDesc>
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
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          borderRadius="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          spacing="10px"
                          padding="10px"
                        >
                          <Typography
                            variant="caption"
                            color="rgba(255, 255, 255, 0.8)"
                          >
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
                              <FormLabel>{sessionLocation}</FormLabel>
                              <FormLabelDesc>
                                Sessions booked: {bookedSessions.length}
                              </FormLabelDesc>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <FormLabel>Book a Date*</FormLabel>
                      <FormLabelDesc>
                        View and select the available dates and times for this
                        location
                      </FormLabelDesc>
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
                        <Typography variant="bodyBB">Start Time*</Typography>
                        <TimePicker
                          value={sessionStartTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null)
                              setSessionStartTime(newValue);
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
                        <Typography variant="bodyBB">End Time*</Typography>
                        <TimePicker
                          value={sessionEndTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) setSessionEndTime(newValue);
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
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
                    {sessionDate && sessionStartTime && sessionEndTime && (
                      <Stack spacing="20px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          spacing="10px"
                          padding="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          borderRadius="10px"
                        >
                          <Typography
                            variant="caption"
                            color="rgba(255, 255, 255, 0.8)"
                          >
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
                            <Box display="flex" alignItems="center" gap="4px">
                              <Typography
                                variant="bodyS"
                                color="text.secondary"
                              >
                                Start Time:{' '}
                              </Typography>
                              <Typography variant="body2">
                                {`${sessionStartTime.format('HH')}:` +
                                  `${sessionStartTime.format('mm')}` +
                                  `${sessionStartTime.format('A')}`}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap="4px">
                              <Typography
                                variant="bodyS"
                                color="text.secondary"
                              >
                                End Time:{' '}
                              </Typography>
                              <Typography variant="body2">
                                {`${sessionEndTime.format('HH')}:` +
                                  `${sessionStartTime.format('mm')}` +
                                  `${sessionEndTime.format('A')}`}
                              </Typography>
                            </Box>
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
                    <FormLabel>Virtual Location</FormLabel>
                    <FormLabelDesc>
                      Provide a URL where this session will be hosted
                    </FormLabelDesc>
                    <ZuInput
                      onChange={(e) => setSessionVideoURL(e.target.value)}
                      placeholder="https://"
                    />
                  </Stack>
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <FormLabel>Select a Date*</FormLabel>
                      <FormLabelDesc>
                        Pick a date for this session
                      </FormLabelDesc>
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
                        <Typography variant="bodyBB">Start Time*</Typography>
                        <TimePicker
                          value={sessionStartTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null)
                              setSessionStartTime(newValue);
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
                        <Typography variant="bodyBB">End Time*</Typography>
                        <TimePicker
                          value={sessionEndTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) setSessionEndTime(newValue);
                          }}
                          shouldDisableTime={(date: Dayjs, view: TimeView) => {
                            if (view === 'minutes' || view === 'hours') {
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
              <FormTitle>Session Participants</FormTitle>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <FormLabel>Organizers*</FormLabel>
                  <FormLabelDesc>Type or search a person</FormLabelDesc>
                </Stack>
                <Box>
                  <Select
                    multiple
                    value={organizers}
                    style={{ width: '100%' }}
                    onChange={handleOrganizerChange}
                    input={<OutlinedInput label="Name" />}
                    renderValue={(selected) => selected.join(', ')}
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
                          <SelectCheckItem
                            label={i.username}
                            isChecked={
                              organizers.findIndex(
                                (item) => item === i.username,
                              ) > -1
                            }
                          />
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
                          const newArray = organizers.filter(
                            (item) => item !== i,
                          );
                          setOrganizers(newArray);
                          const newDIDs = sessionOrganizers.filter(
                            (_, ind) => ind !== index,
                          );
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
                  <FormLabel>Speakers</FormLabel>
                  <FormLabelDesc>Type or search a person</FormLabelDesc>
                </Stack>
                <Box>
                  <Select
                    multiple
                    value={speakers}
                    style={{ width: '100%' }}
                    onChange={handleSpeakerChange}
                    input={<OutlinedInput label="Name" />}
                    renderValue={(selected) => selected.join(', ')}
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
                          <SelectCheckItem
                            label={i.username}
                            isChecked={
                              speakers.findIndex(
                                (item) => item === i.username,
                              ) > -1
                            }
                          />
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
                          const newArray = speakers.filter(
                            (item) => item !== i,
                          );
                          setSpeakers(newArray);
                          const newDIDs = sessionSpeakers.filter(
                            (_, ind) => ind !== index,
                          );
                          setSessionSpeakers(newDIDs);
                        }}
                        key={`Selected_Speaker${index}`}
                      />
                    );
                  })}
                </Box>
                {/* <Stack direction="row" spacing="10px">
                  <Stack
                    direction="row"
                    spacing="10px"
                    alignItems="center"
                    bgcolor="#313131"
                    borderRadius="10px"
                    padding="4px 10px"
                  >
                    <Box
                      component="img"
                      width="26px"
                      height="26px"
                      borderRadius="100px"
                      src="/21.jpg"
                    />
                    <Typography variant="bodyMB">QJ</Typography>
                    <XMarkIcon size={4} />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="10px"
                    alignItems="center"
                    bgcolor="#313131"
                    borderRadius="10px"
                    padding="4px 10px"
                  >
                    <Box
                      component="img"
                      width="26px"
                      height="26px"
                      borderRadius="100px"
                      src="/drivenfast.webp"
                    />
                    <Typography variant="bodyMB">drivenfast</Typography>
                    <XMarkIcon size={4} />
                  </Stack>
                </Stack> */}
              </Stack>
            </Stack>
            <Box display="flex" gap="20px" marginBottom="20px">
              <ZuButton
                sx={{
                  flex: 1,
                }}
                startIcon={<XMarkIcon size={5} />}
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
                startIcon={<PlusCircleIcon color="#67DBFF" size={5} />}
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
    <Stack direction={'column'} spacing="40px">
      <SessionHeader onToggle={toggleDrawer} />
      <SessionList
        sessions={sessions}
        setSelectedSession={setSelectedSession}
      />
      <SwipeableDrawer
        hideBackdrop={true}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {List('right')}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Sessions;
