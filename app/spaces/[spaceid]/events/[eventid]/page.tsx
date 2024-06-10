'use client';
import React, { useEffect, useState } from 'react';
import { Stack, Grid, useTheme, useMediaQuery, Typography, Divider, Box, FormControl, OutlinedInput, InputAdornment, SwipeableDrawer, Select, Chip, MenuItem } from '@mui/material';
import { IconSidebar, Header, Thumb, Sidebar } from './components';
import {
  EventName,
  EventAbout,
  EventDetail,
  EventRegister
} from 'components/event';
import { CeramicResponseType, EventEdge, Event, Session, SessionData } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import { LockIcon, PlusCircleIcon, XMarkIcon, ArchiveBoxIcon, SearchIcon, ArrowDownIcon, ChevronDownIcon } from '@/components/icons';
import SessionCard from '../../adminevents/[eventid]/Tabs/Sessions/components/SessionList/SessionCard';
import { ZuButton, ZuInput, ZuSwitch } from '@/components/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import TextEditor from '@/components/editor/editor';
import BpCheckbox from './components/Checkbox';
import { SPACE_CATEGORIES } from '@/constant';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

const Home = () => {
  const [tabName, setTabName] = useState<string>('Sessions');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));
  const [eventData, setEventData] = useState<Event>();
  const [sessions, setSessions] = useState<Session[]>([]);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const params = useParams();
  const eventId = params.eventid.toString();

  const { composeClient, isAuthenticated, profile } = useCeramicContext();

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
              space {
                name
                gated
              }
              profile {
                username
                avatar
              }
              customLinks {
                title
                links
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
                tagline
                timezone
                video_url
                description
                meeting_url
                experience_level
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSessions();
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

  const profileId = profile?.id || '';

  const List = (anchor: Anchor) => {
    const [person, setPerson] = useState(true);
    const [online, setOnline] = useState(false);
    const [editor, setEditorInst] = useState<any>();
    const [sessionName, setSessionName] = useState<string>('');
    const [sessionTrack, setSessionTrack] = useState<string>('');
    const [sessionTags, setSessionTags] = useState<Array<string>>([]);
    const [sessionDescription, setSessionDescription] = useState<string>('Test Session');
    const [sessionType, setSessionType] = useState<string>('');
    const [sessoinStatus, setSessionStatus] = useState<string>('');
    const [sessionGated, setSessionGated] = useState<string>('');
    const [sessionExperienceLevel, setSessionExperienceLevel] = useState<string>('');
    // const [sessionFormat, setSessionFormat] = useState<string>("");
    const [sessionVideoURL, setSessionVideoURL] = useState<string>('');
    const [sessionStartTime, setSessionStartTime] = useState<Dayjs | null>(
      dayjs(),
    );
    const [sessionEndTime, setSessionEndTime] = useState<Dayjs | null>(dayjs());
    const [sessionOrganizers, setSessionOrganizers] = useState<Array<string>>([]);
    const [sessionSpeakers, setSessionSpeakers] = useState<Array<string>>([]);


    const handleChange = (e: any) => {
      setSessionTags(
        typeof e.target.value === 'string'
          ? e.target.value.split(',')
          : e.target.value,
      );
    };

    const createSession = async () => {
      console.log("id", profileId, sessionGated);
      if (!isAuthenticated) {
        console.log('Not authenticated');
        return;
      }

      const output = await editor.save();
      let strDesc: any = JSON.stringify(output);

      strDesc = strDesc.replaceAll('"', '\\"');

      const error = !eventId || !sessionStartTime || !sessionEndTime || !sessionName || !sessoinStatus || !sessionTags || !sessionTrack || !profileId;

      if (error) {
        typeof window !== 'undefined' &&
          window.alert(
            'Please fill necessary fields!',
          );
        return;
      }

      if (person) {
        const update = await composeClient.executeQuery(`
        mutation {
          createSession(
            input: {
              content: {
                title: "${sessionName}",
                createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                profileId: "${profileId}",
                eventId: "${params.eventid.toString()}",
                tags: "${sessionTags.join(',')}",
                status: "${sessoinStatus}",
                format: "person",
                track: "${sessionTrack}",
                gated: "${sessionGated}",
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
            }
          }
        }
        `);
        toggleDrawer('right', false);
        await getSessions();
      } else {
        const update = await composeClient.executeQuery(`
        mutation {
          createSession(
            input: {
              content: {
                title: "${sessionName}",
                createdAt: "${dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                startTime: "${sessionStartTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                endTime: "${sessionEndTime?.format('YYYY-MM-DDTHH:mm:ss[Z]')}",
                profileId: "${profileId}",
                eventId: "${params.eventid.toString()}",
                tags: "${sessionTags.join(',')}",
                status: "${sessoinStatus}",
                format: "online",
                track: "${sessionTrack}",
                gated: "${sessionGated}",
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
            }
          }
        }
        `);
        console.log("update", update)
        toggleDrawer('right', false);
        await getSessions();
      }
    };

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
                <ZuInput
                  onChange={(e) => setSessionTrack(e.target.value)}
                  placeholder="Select"
                />
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
                          SPACE_CATEGORIES.find(
                            (item) => item.value === tag,
                          )?.label
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
                  holder="space_description"
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                  }}
                  editor={editor}
                  setEditorInst={setEditorInst}
                />
                <Stack
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
                </Stack>
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
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Status</Typography>
                <Typography variant="bodyS">
                  Choose a status for your session to relay its nature to guests
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionStatus(e.target.value)}
                  placeholder="Type Session Status"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Gated</Typography>
                <Typography variant="bodyS">
                  Gated
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionGated(e.target.value)}
                  placeholder="Gated"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Experience Level</Typography>
                <Typography variant="bodyS">
                  Select a level experience may be needed for this session
                </Typography>
                <ZuInput
                  onChange={(e) => setSessionExperienceLevel(e.target.value)}
                  placeholder="Beginner OR Intermediate OR Advanced"
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
                    <ZuInput placeholder="Room" />
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
                          <Typography variant="bodyBB">Room One</Typography>
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
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <Typography variant="bodyBB">Book a Date*</Typography>
                      <Typography variant="bodyS">
                        View and select the available dates and times for this
                        location
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
                        <Typography variant="bodyBB">May 23, 2024</Typography>
                        <Typography variant="bodyS">
                          Start Time: 8:30AM
                        </Typography>
                        <Typography variant="bodyS">
                          End Time: : 10:30AM
                        </Typography>
                      </Stack>
                    </Stack>
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
                <FormControl focused sx={{ border: 'none' }}>
                  <OutlinedInput
                    placeholder="Search or add a person"
                    sx={{
                      backgroundColor:
                        'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
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
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Stack direction="row" spacing="10px">
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
                </Stack>
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
                <FormControl focused sx={{ border: 'none' }}>
                  <OutlinedInput
                    placeholder="Search or add a person"
                    sx={{
                      backgroundColor:
                        'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
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
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Stack direction="row" spacing="10px">
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
                </Stack>
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
    <Stack direction="row" width="100%">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && <Sidebar />}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header name={eventData?.title} />
        <Thumb tabName={tabName} setTabName={setTabName} />
        {
          tabName === "About" && (
            <Stack padding="40px" justifyContent="center" alignItems="center">
              {eventData && (
                <Stack width={900}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                      <EventName
                        endTime={eventData.endTime}
                        startTime={eventData.startTime}
                        eventDescription={eventData.description}
                        spaceName={eventData.space?.name}
                        eventName={eventData.title}
                        location=""
                        organizer={eventData.profile?.username as string}
                        image_url={eventData.image_url}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <EventRegister />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <EventAbout tagline={eventData.tagline} description={eventData.description} />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <EventDetail status={eventData.status} links={eventData.customLinks} />
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </Stack>
          )
        }
        {
          tabName === "Sessions" && (
            <Stack padding="20px 80px">
              <Grid container spacing="30px">
                <Grid item xs={12} md={8}>
                  <Stack borderRadius="10px" border="1px solid #383838" bgcolor="#262626" flex={8}>
                    <Stack spacing="10px" padding="10px">
                      <Typography textAlign="center" padding="10px" variant="bodyBB" bgcolor="#2c2c2c" borderRadius="10px">
                        Monday, October 30
                      </Typography>
                      {
                        sessions.length !== 0 ? sessions.map((session, index) => (
                          <SessionCard
                            key={`SessionCard-${index}`}
                            title={session.title}
                            startTime={session.startTime}
                            endTime={session.endTime}
                            location={session.meeting_url}
                          />
                        )) : (
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
                        )
                      }
                    </Stack>
                  </Stack>

                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack borderRadius="10px" border="1px solid #383838" bgcolor="#262626" padding="10px" flex={4}>
                    <Stack paddingY="10px">
                      <ZuButton startIcon={<LockIcon />} sx={{ width: "100%" }}
                        onClick={() => toggleDrawer('right', true)}
                      >
                        Add a Session
                      </ZuButton>
                    </Stack>
                    <Stack spacing="10px" divider={<Divider sx={{ border: "1px solid #383838" }} />}>
                      <Typography variant="subtitleSB">
                        Sessions: Sort & Filter
                      </Typography>
                      <Stack paddingY="10px" spacing="10px">
                        <ZuInput placeholder="Tracks" />
                        <ZuInput placeholder="Dates" />
                        <ZuInput placeholder="Location" />
                      </Stack>
                      <Stack spacing="10px">
                        <Typography variant="bodyMB">
                          Gated For:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap="10px">
                          <ZuButton>
                            ZuConnect Resident
                          </ZuButton>
                          <ZuButton>
                            DevConnect Attendee
                          </ZuButton>
                          <ZuButton>
                            Zuzalu Resident
                          </ZuButton>
                        </Stack>
                      </Stack>
                    </Stack>
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
                {List('right')}
              </SwipeableDrawer>
            </Stack>
          )
        }
      </Stack>
    </Stack>
  );
};

export default Home;
