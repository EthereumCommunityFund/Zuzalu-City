'use client';
import React, {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  SwipeableDrawer,
  Stack,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircleIcon, PlusIcon, XMarkIcon } from 'components/icons';
import { EventHeader, CurrentEvents, PastEvents, Invite } from './components';
import { ZuButton, ZuInput } from 'components/core';
import TextEditor from '@/components/editor/editor';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import BpCheckbox from '@/components/event/Checkbox';
import { OutputData } from '@editorjs/editorjs';
import { Event, EventData, Space, SpaceEventData } from '@/types';
import { createConnector } from '@lxdao/uploader3-connector';
import {
  TICKET_FACTORY_ADDRESS,
  ticketFactoryGetContract,
  SOCIAL_TYPES,
} from '@/constant';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { supabase } from '@/utils/supabase/client';
import { useAccount } from 'wagmi';
import Input from '@/components/core/Input';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';

interface Inputs {
  name: string;
  symbol: string;
  tagline: string;
  participant: number;
  max_participant: number;
  min_participant: number;
  timezone: string;
}

interface EventDocument {
  document: {
    id: string;
  };
}
interface CreateEvent {
  createEvent: EventDocument;
}

interface UpdateType {
  data: CreateEvent;
}

export interface IEventArg {
  args: {
    eventId: string;
  };
}

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const { address, isConnected } = useAccount();

  const connector = createConnector('NFT.storage', {
    token: process.env.NEXT_PUBLIC_CONNECTOR_TOKEN ?? '',
  });

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [space, setSpace] = useState<Space>();

  const [events, setEvents] = useState<Event[]>([]);
  const { ceramic, composeClient, profile } = useCeramicContext();

  const getSpaceByID = async () => {
    try {
      const GET_SPACE_QUERY = `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
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
            events(first: 10) {
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
                }
              }
            }
          }
        }
      }
      `;
      const spaceId = params.spaceid.toString();

      const response: any = await composeClient.executeQuery(GET_SPACE_QUERY, {
        id: spaceId,
      });
      const spaceData: Space = response.data.node as Space;
      setSpace(spaceData);

      const eventData: SpaceEventData = response.data.node
        .events as SpaceEventData;
      const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
      setEvents(fetchedEvents);
      return spaceData;
    } catch (error) {
      console.error('Failed to fetch space:', error);
    }
  };

  const getEvents = async () => {
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
              space {
                avatar
              }
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
        setEvents(fetchedEvents.filter((event) => event.spaceId === spaceId));
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
        await getEvents();
        await getSpaceByID();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const List = (anchor: Anchor) => {
    const [person, setPerson] = useState(true);
    const [online, setOnline] = useState(false);
    const [inputs, setInputs] = useState<Inputs>({
      name: '',
      symbol: '',
      tagline: '',
      participant: 0,
      min_participant: 0,
      max_participant: 0,
      timezone: '',
    });

    const [description, setDescription] = useState<OutputData>();
    const [avatar, setAvatar] = useState<SelectedFile>();
    const [avatarURL, setAvatarURL] = useState<string>();
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
    const socialLinksRef = useRef<HTMLDivElement>(null);
    const [socialLinks, setSocialLinks] = useState<number[]>([0]);
    const [status, setStatus] = useState<string>('');
    const [locations, setLocations] = useState<string[]>(['']);
    const [track, setTrack] = useState<string>('');
    const [tracks, setTracks] = useState<string[]>([]);
    const [error, setError] = useState(false);

    const profileId = profile?.id || '';

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (
        name === 'participant' ||
        name === 'max_participant' ||
        name === 'min_participant'
      ) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: Number(value),
        }));
      } else {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value,
        }));
      }
    };

    const handleClose = () => {
      toggleDrawer('right', false);
    };

    const handleAddSocialLink = () => {
      if (socialLinks.length === 0) {
        setSocialLinks([0]);
        return;
      }
      const nextItem = Math.max(...socialLinks);
      const temp = [...socialLinks, nextItem + 1];
      setSocialLinks(temp);
    };

    const handleRemoveSociaLink = (index: number) => {
      const temp = socialLinks.filter((item) => item !== index);
      setSocialLinks(temp);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setTrack(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setTracks([...tracks, track]);
        setTrack('');
      }
    };

    const createEvent = async () => {
      const isNeeded =
        inputs.name.length === 0 ||
        !startTime ||
        !endTime ||
        !spaceId ||
        !profileId;
      if (isNeeded) {
        typeof window !== 'undefined' &&
          window.alert('Please input all necessary fields.');
      } else {
        let socialLinks = {};

        if (
          socialLinksRef.current &&
          socialLinksRef &&
          socialLinksRef.current.children.length > 2
        ) {
          for (let i = 0; i < socialLinksRef.current.children.length - 2; i++) {
            const key =
              socialLinksRef.current.children[i + 1].children[0].querySelector(
                'input',
              )?.value;
            const value =
              socialLinksRef.current.children[i + 1].children[1].querySelector(
                'input',
              )?.value;
            if (key) {
              socialLinks = { ...socialLinks, [key]: value };
            }
          }
        }
        // const output = await editor.save();
        let strDesc: any = JSON.stringify(description);

        if (
          !description ||
          !description.blocks ||
          description.blocks.length == 0
        ) {
          setError(true);
          return;
        }
        strDesc = strDesc.replaceAll('"', '\\"');

        try {
          const update: any = await composeClient.executeQuery(
            `
         mutation CreateEventMutation($input: CreateEventInput!) {
           createEvent(
             input: $input
           ) {
             document {
               id
               spaceId
               title
               description
               tagline
               image_url
               createdAt
               startTime
               endTime
               profileId,
               participant_count
               max_participant
               min_participant
               status
               customLinks {
                 title
                 links
               }
               tracks
             }
           }
         }
         `,
            {
              input: {
                content: {
                  title: inputs.name,
                  description: strDesc,
                  tagline: inputs.tagline,
                  spaceId: spaceId,
                  profileId: profileId,
                  image_url: avatarURL,
                  createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  endTime: endTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  customLinks: Object.entries(socialLinks).map(
                    ([key, value]) => ({ title: key, links: value }),
                  ),
                  participant_count: inputs.participant,
                  max_participant: inputs.max_participant,
                  min_participant: inputs.min_participant,
                  status: person ? 'In-Person' : 'Online',
                  tracks: tracks.join(','),
                },
              },
            },
          );

          const { data } = await supabase.from('locations').insert({
            name: locations.join(','),
            eventId: update.data.createEvent.document.id,
          });

          typeof window !== 'undefined' &&
            window.alert(
              'Submitted! Create process probably complete after few minute. Please check it in Space List page.',
            );
          router.push('/spaces');
        } catch (err) {
          console.log(err);
        }
        // `);
        // console.log(update);
        // toggleDrawer('right', false);
        // await getEvents();
      }

      toggleDrawer('right', false);
      await getEvents();
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
            backgroundColor: '#222222',
          }}
          role="presentation"
          zIndex="10"
          borderLeft="1px solid #383838"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            height="50px"
            borderBottom="1px solid #383838"
            paddingX={3}
          >
            <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
              Close
            </ZuButton>
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Create Event
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#262626" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <Typography variant="subtitleSB">Event Basic</Typography>
              </Box>
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
                <Stack spacing="10px">
                  <Typography variant="subtitleSB">Event Name</Typography>
                  <ZuInput
                    onChange={handleInputChange}
                    name="name"
                    placeholder="Type an awesome name"
                  />
                </Stack>
                <Stack spacing="10px">
                  <Typography variant="subtitleSB">Event Tagline</Typography>
                  <ZuInput
                    onChange={handleInputChange}
                    name="tagline"
                    placeholder="Write a short, one-sentence tagline for your event"
                  />
                </Stack>
              </Box>

              <Stack spacing="10px">
                <Typography variant="subtitleSB">Event Description</Typography>
                <Typography color="white" variant="caption">
                  This is a description greeting for new members. You can also
                  update descriptions.
                </Typography>
                <TextEditor
                  holder="event_description"
                  value={description}
                  setData={setDescription}
                  sx={{
                    backgroundColor: '#ffffff0d',
                    fontFamily: 'Inter',
                    color: 'white',
                    padding: '12px 12px 12px 80px',
                    borderRadius: '10px',
                    height: 'auto',
                    minHeight: '270px',
                    overflow: 'auto',
                    '& > div > div': {
                      paddingBottom: '0px !important',
                    },
                  }}
                />
                <Stack direction="row" justifyContent="space-between">
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
                      <Typography color="white" variant="caption">
                        Markdown Available
                      </Typography>
                    </Stack> */}
                  <Typography variant="caption" color="white">
                    {5000 -
                      (description
                        ? description.blocks
                            .map((item) => item.data.text.length)
                            .reduce((prev, current) => prev + current, 0)
                        : 0)}{' '}
                    Characters Left
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="subtitleSB">Event Avatar</Typography>
              <Typography variant="bodyS">
                Recommend min of 200x200px (1:1 Ratio)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Uploader3
                  accept={['.gif', '.jpeg', '.gif', '.png']}
                  connector={connector}
                  multiple={false}
                  crop={false} // must be false when accept is svg
                  onChange={(files: any) => {
                    setAvatar(files[0]);
                  }}
                  onUpload={(file: any) => {
                    setAvatar(file);
                  }}
                  onComplete={(result: any) => {
                    setAvatarURL(result?.url);
                  }}
                >
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                    }}
                  >
                    Upload
                  </Button>
                </Uploader3>
                <PreviewFile
                  sx={{
                    width: '420px',
                    height: '420px',
                    borderRadius: '10px',
                  }}
                  file={avatarURL}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" gap="20px">
                <Box flex={1}>
                  <Typography variant="subtitleSB">Start Date</Typography>
                  <DatePicker
                    onChange={(newValue) => setStartTime(newValue)}
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
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitleSB">End Date</Typography>
                  <DatePicker
                    onChange={(newValue) => setEndTime(newValue)}
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
                </Box>
              </Box>
              <Stack spacing="10px">
                <Typography variant="subtitleSB">Participant</Typography>
                <ZuInput
                  onChange={handleInputChange}
                  type="number"
                  name="participant"
                  placeholder="Type Participant"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="subtitleSB">Max Participant</Typography>
                <ZuInput
                  onChange={handleInputChange}
                  type="number"
                  name="max_participant"
                  placeholder="Type Max Participant"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="subtitleSB">Min Participant</Typography>
                <ZuInput
                  onChange={handleInputChange}
                  type="number"
                  name="min_participant"
                  placeholder="Type Min Participant"
                />
              </Stack>
            </Box>
          </Box>
          <Box bgcolor="#262626" borderRadius="10px">
            <Box
              padding="20px"
              display="flex"
              justifyContent="space-between"
              borderBottom="1px solid #383838"
            >
              <Typography variant="subtitleSB">Event Format</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              padding="20px"
            >
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
                    <Typography variant="bodyBB">In-Person</Typography>
                    <Typography variant="caption">
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
                    <Typography variant="bodyBB">Online</Typography>
                    <Typography variant="caption">
                      Specially Online Event
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <Stack spacing="10px">
                <Typography variant="subtitleSB">Location</Typography>
                {locations.map((location, index) => (
                  <ZuInput
                    key={`Location_Index${index}`}
                    placeholder="city, country"
                    onChange={(e) => {
                      let newLocations = locations;
                      newLocations[index] = e.target.value;
                      setLocations(newLocations);
                    }}
                  />
                ))}
              </Stack>
              <ZuButton
                variant="contained"
                endIcon={<PlusIcon />}
                onClick={() => setLocations((prev) => [...prev, ''])}
              >
                Add Address
              </ZuButton>
            </Box>
          </Box>
          <Box bgcolor="#262626" borderRadius="10px">
            <Box padding="20px" display="flex" justifyContent="space-between">
              <Typography variant="subtitleSB">Links</Typography>
            </Box>
            <Box
              padding={'20px'}
              display={'flex'}
              flexDirection={'column'}
              gap={'30px'}
              ref={socialLinksRef}
            >
              <Typography
                fontSize={'18px'}
                fontWeight={700}
                lineHeight={'120%'}
                color={'white'}
              >
                Social Links
              </Typography>
              {socialLinks.map((item, index) => {
                return (
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    gap={'20px'}
                    key={index}
                  >
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        Select Social
                      </Typography>
                      <Select
                        placeholder="Select"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              backgroundColor: '#222222',
                            },
                          },
                        }}
                        sx={{
                          '& > div': {
                            padding: '8.5px 12px',
                            borderRadius: '10px',
                          },
                        }}
                      >
                        {SOCIAL_TYPES.map((social, index) => {
                          return (
                            <MenuItem value={social.key} key={index}>
                              {social.value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'10px'}
                      flex={1}
                    >
                      <Typography
                        fontSize={'16px'}
                        fontWeight={700}
                        color={'white'}
                      >
                        URL
                      </Typography>
                      <TextField
                        variant="outlined"
                        placeholder="https://"
                        sx={{
                          opacity: '0.6',
                          '& > div > input': {
                            padding: '8.5px 12px',
                          },
                        }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'flex-end'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveSociaLink(item)}
                    >
                      <Box
                        sx={{
                          borderRadius: '10px',
                          width: '40px',
                          height: '40px',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <CancelIcon />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  textTransform: 'unset',
                  color: 'white',
                }}
                onClick={handleAddSocialLink}
              >
                <AddCircleIcon />
                <Typography color="white">Add Social Link</Typography>
              </Button>
            </Box>
          </Box>
          <Stack bgcolor="#262626" borderRadius="10px">
            <Typography variant="subtitleMB" padding="20px">
              Event Tracks
            </Typography>
            <Stack padding="20px" spacing="30px">
              <Typography variant="bodyB">
                Tracks are the main categories for this event. This allows
                sessions to be organized into relevant tracks by attributing to
                a particular track.
              </Typography>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Event Tracks</Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                    Create tracks related to your event
                  </Typography>
                </Stack>
                <ZuInput
                  placeholder="Add a tag"
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  value={track}
                />
                <Stack direction="row" spacing="10px">
                  {tracks.length !== 0 &&
                    tracks.map((track, index) => (
                      <Chip
                        key={`TrackChip-${index}`}
                        label={track}
                        sx={{
                          borderRadius: '10px',
                          bgcolor: '#313131',
                        }}
                        onDelete={() => {
                          const newArray = tracks.filter(
                            (item) => item !== track,
                          );
                          setTracks(newArray);
                        }}
                      />
                    ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Box display="flex" gap="20px">
            <Button
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#373737',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid #383838',
                flex: 1,
              }}
              startIcon={<XMarkIcon />}
            >
              Discard
            </Button>
            <Button
              sx={{
                color: '#67DBFF',
                borderRadius: '10px',
                backgroundColor: 'rgba(103, 219, 255, 0.10)',
                fontSize: '14px',
                padding: '6px 16px',
                flex: 1,
                border: '1px solid rgba(103, 219, 255, 0.20)',
              }}
              startIcon={<PlusCircleIcon color="#67DBFF" />}
              onClick={createEvent}
            >
              Create Event
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };
  return (
    <Stack direction="row" width={'100%'}>
      <SubSidebar
        title={space?.name}
        spaceId={params.spaceid.toString()}
        avatar={space?.avatar}
        banner={space?.banner}
      />
      <Box width="100%" borderLeft="1px solid #383838">
        <EventHeader />
        <CurrentEvents events={events} onToggle={toggleDrawer} />
        {/* <PastEvents /> */}
        <Invite />
        <SwipeableDrawer
          hideBackdrop={true}
          sx={{
            '& .MuiDrawer-paper': {
              marginTop: '111px',
              height: 'calc(100% - 111px)',
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
      </Box>
    </Stack>
  );
};

export default Home;
