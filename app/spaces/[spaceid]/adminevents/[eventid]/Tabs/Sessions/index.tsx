import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
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
  Radio,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SessionHeader, SessionAdd, SessionList } from './components';
import { ZuButton, ZuInput, ZuSwitch } from 'components/core';
import {
  XMarkIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  ArrowDownIcon,
  ChevronDownIcon,
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
} from '@/types';
import { OutputData } from '@editorjs/editorjs';
import { EXPREIENCE_LEVEL_TYPES, SPACE_CATEGORIES } from '@/constant';
import { supabase } from '@/utils/supabase/client';

dayjs.extend(utc);
dayjs.extend(timezone);

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

const Sessions = () => {
  const params = useParams();
  const [isChecked, setIsChecked] = React.useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [eventData, setEventData] = useState<Event>();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [editor, setEditorInst] = useState<any>();
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionTrack, setSessionTrack] = useState<string>('');
  const [sessionTags, setSessionTags] = useState<Array<string>>([]);
  const [sessionDescription, setSessionDescription] = useState<OutputData>();
  const [sessionType, setSessionType] = useState<string>('');
  const [sessoinStatus, setSessionStatus] = useState<string>('');
  const [sessionGated, setSessionGated] = useState<boolean>(false);
  const [sessionExperienceLevel, setSessionExperienceLevel] =
    useState<string>('');
  const [sessionVideoURL, setSessionVideoURL] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<Dayjs | null>();
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs | null>();
  const [sessionEndTime, setSessionEndTime] = useState<Dayjs | null>();
  const [sessionOrganizers, setSessionOrganizers] = useState<Array<string>>([]);
  const [organizers, setOrganizers] = useState<Array<string>>([]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<string>>([]);
  const [speakers, setSpeakers] = useState<Array<string>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>();
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
        .from('venue')
        .select('*')
        .eq('eventid', eventId);
      if (data !== null) {
        setLocations(data.map((item) => item.name));
      }
    } catch (err) {
      console.log(err);
    }
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
        await getSessions();
        await getPeople();
        await getLocation();
        await getEventDetailInfo();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
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

    // const output = await editor.save();
    let strDesc: any = JSON.stringify(sessionDescription);

    strDesc = strDesc.replaceAll('"', '\\"');
    const error =
      !eventId ||
      !sessionStartTime ||
      !sessionEndTime ||
      !sessionName ||
      !sessoinStatus ||
      !sessionTags ||
      !sessionTrack ||
      !sessionDescription ||
      !sessionGated.toString() ||
      !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert('Please fill necessary fields!');
      return;
    }

    const format = person ? 'person' : 'online';

    if (person) {
      try {
        const update = await composeClient.executeQuery(`
          mutation {
            createSession(
              input: {
                content: {
                  title: "${sessionName}",
                  description: "${strDesc}",
                  experience_level: "${sessionExperienceLevel}",
                  createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  profileId: "${profileId}",
                  eventId: "${params.eventid.toString()}",
                  tags: "${sessionTags.join(',')}",
                  type: "${sessionType}",
                  status: "${sessoinStatus}",
                  format: "${format}",
                  track: "${sessionTrack}",
                  gated: "${sessionGated}",
                  timezone: "${dayjs.tz.guess()}",
                  speakers: ${JSON.stringify(sessionSpeakers)},
                  organizers: ${JSON.stringify(sessionOrganizers)},
                }
              }
            ) {
              document {
                id
                title
                createdAt
                startTime
                endTime
                eventId
                profileId
                tags
                status
                format
                track
                gated
                description
              }
            }
          }
        `);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
      toggleDrawer('right', false);
      await getSessions();
    } else {
      try {
        const update = await composeClient.executeQuery(`
          mutation {
            createSession(
              input: {
                content: {
                  title: "${sessionName}",
                  description: "${strDesc}",
                  experience_level: "${sessionExperienceLevel}",
                  createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                  profileId: "${profileId}",
                  eventId: "${params.eventid.toString()}",
                  tags: "${sessionTags.join(',')}",
                  type: "${sessionType}",
                  status: "${sessoinStatus}",
                  format: "${format}",
                  track: "${sessionTrack}",
                  gated: "${sessionGated}",
                  timezone: "${dayjs.tz.guess()}",
                  video_url: "${sessionVideoURL}",
                  speakers: ${JSON.stringify(sessionSpeakers)},
                  organizers: ${JSON.stringify(sessionOrganizers)},
                }
              }
            ) {
              document {
                id
                title
                createdAt
                startTime
                endTime
                eventId
                profileId
                tags
                status
                format
                track
                gated
                description
              }
            }
          }
        `);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
      toggleDrawer('right', false);
      await getSessions();
    }
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
                <Typography variant="bodyS">
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
                  <Typography variant="bodyS">
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
                <Typography variant="bodyS">
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
                {/* <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width="20"
                    height="15"
                    viewBox="0 0 20 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_4575_7884)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.80085 4.06177H2.83984V11.506H4.88327V7.3727L6.82879 10.0394L8.68199 7.3727V11.506H10.6226V4.06177H8.68199L6.82879 6.81714L4.80085 4.06177ZM1.55636 0.794922H18.4436C19.3028 0.794922 20 1.59076 20 2.57247V13.0174C20 13.9989 19.3032 14.7949 18.4436 14.7949H1.55636C0.697166 14.7949 0 13.9991 0 13.0174V2.57247C0 1.59091 0.696805 0.794922 1.55636 0.794922ZM14.0078 4.10603H13.9884V7.92826H12.1206L15 11.506L17.8795 7.90628H15.9347V4.10603H14.0078Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4575_7884">
                        <rect
                          width="20"
                          height="14"
                          fill="white"
                          transform="translate(0 0.794922)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <Typography variant="bodyS">Markdown Available</Typography>
                </Stack> */}
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Type</Typography>
                <Typography variant="bodyS">
                  Choose a type for your session to relay its nature to guests
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="Meetup, Activity, Party, etc.."
                />
              </Stack>
              {/* <Stack spacing="10px">
                <Typography variant="bodyBB">Session Status</Typography>
                <Typography variant="bodyS">
                  Choose a status for your session to relay its nature to guests
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionStatus(e.target.value)}
                  placeholder="Type Session Status"
                />
              </Stack> */}
              {/* <Stack spacing="10px">
                <Typography variant="bodyBB">Session Gated</Typography>
                <Stack direction="row" alignItems="center">
                  <BpCheckbox
                    checked={sessionGated}
                    onChange={() => setSessionGated((prev) => !prev)}
                  />
                  <Typography variant="bodyS">Gated</Typography>
                </Stack>
              </Stack> */}
              <Stack spacing="10px">
                <Typography variant="bodyBB">Experience Level</Typography>
                <Typography variant="bodyS">
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
                    {sessionLocation && sessionLocation === 'Custom' && (
                      <Stack>
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack spacing="10px">
                          <Typography variant="bodyBB">
                            Custom Location
                          </Typography>
                          <Typography variant="bodyS">
                            Write name of the location
                          </Typography>
                          <ZuInput
                            placeholder="Type location name"
                            onChange={(e) => setCustomLocation(e.target.value)}
                          />
                          <ZuButton
                            endIcon={
                              !isDirections ? (
                                <PlusIcon size={5} />
                              ) : (
                                <MinusIcon size={5} />
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
                      <Typography variant="bodyBB">Book a Date*</Typography>
                      <Typography variant="bodyS">
                        View and select the available dates and times for this
                        location
                      </Typography>
                      <DatePicker
                        onChange={(newValue) => setSessionDate(newValue)}
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
                        <DateTimePicker
                          onChange={(newValue) => setSessionStartTime(newValue)}
                          views={['hours', 'minutes']}
                          timeSteps={Custom_Option}
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
                        <DateTimePicker
                          onChange={(newValue) => setSessionEndTime(newValue)}
                          views={['hours', 'minutes']}
                          timeSteps={Custom_Option}
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
                        onChange={(newValue) => setSessionStartTime(newValue)}
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
                        <DateTimePicker
                          onChange={(newValue) => setSessionStartTime(newValue)}
                          views={['hours', 'minutes']}
                          timeSteps={Custom_Option}
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
                        <DateTimePicker
                          onChange={(newValue) => setSessionEndTime(newValue)}
                          views={['hours', 'minutes']}
                          timeSteps={Custom_Option}
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
              <Stack spacing="20px">
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
              </Stack>
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
    <Stack direction={'column'} spacing={6} paddingBottom={5}>
      <SessionHeader onToggle={toggleDrawer} />
      <SessionList sessions={sessions} />
      <SessionAdd />
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
        {List('right')}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Sessions;
