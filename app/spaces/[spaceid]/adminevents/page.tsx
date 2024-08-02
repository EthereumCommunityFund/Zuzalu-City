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
  FormHelperText,
  FormControl,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircleIcon, PlusIcon, XMarkIcon } from 'components/icons';
import { EventHeader, CurrentEvents, Invite } from './components';
import { ZuButton, ZuInput } from 'components/core';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { SelectedFile, Uploader3 } from '@lxdao/uploader3';
import BpCheckbox from '@/components/event/Checkbox';
import {
  CreateEventRequest,
  Event,
  EventData,
  Space,
  SpaceEventData,
} from '@/types';
import { SOCIAL_TYPES } from '@/constant';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { supabase } from '@/utils/supabase/client';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';

import { useUploaderPreview } from '@/components/PreviewFile/useUploaderPreview';
import { createEventKeySupa } from '@/services/event/createEvent';
import VisuallyHiddenInput from '@/components/input/VisuallyHiddenInput';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAccount } from 'wagmi';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { SuperEditor } from '@/components/editor/SuperEditor';
import { useEditorStore } from '@/components/editor/useEditorStore';
import timezone from 'dayjs/plugin/timezone';
import { TimezoneSelector } from '@/components/select/TimezoneSelector';
import { ITimezoneOption } from 'react-timezone-select';
dayjs.extend(timezone);
interface Inputs {
  name: string;
  symbol: string;
  tagline: string;
  participant: number;
  max_participant: number;
  min_participant: number;
  timezone: string;
  external_url: string;
}

export interface IEventArg {
  args: {
    eventId: string;
  };
}

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const schema = Yup.object().shape({
  socialLinks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Social is required').trim(),
      links: Yup.string()
        .required('URL is required')
        .trim()
        .matches(/^https:\/\//, 'URL must start with https://'),
    }),
  ),
});

type FormData = Yup.InferType<typeof schema>;

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [space, setSpace] = useState<Space>();
  const [reload, setReload] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const { ceramic, composeClient, profile } = useCeramicContext();
  const [showModal, setShowModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      socialLinks: [{ title: '', links: '' }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

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
            admins {
              id
            }
            superAdmin{
              id 
            }
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
              tracks
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
        const space = await getSpaceByID();
        const superAdmins =
          space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
          [];
        const admins =
          space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
        if (!admins.includes(userDID) && !superAdmins.includes(userDID)) {
          router.push('/');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, [reload]);

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
      participant: 10,
      min_participant: 10,
      max_participant: 10,
      timezone: '',
      external_url: 'TBD',
    });

    const descriptionEditorStore = useEditorStore();
    const [avatar, setAvatar] = useState<SelectedFile>();
    const avatarUploader = useUploaderPreview();
    const [selectedTimezone, setSelectedTimezone] = useState<ITimezoneOption>(
      {} as ITimezoneOption,
    );
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
    const socialLinksRef = useRef<HTMLDivElement>(null);
    const [socialLinks, setSocialLinks] = useState<number[]>([0]);
    const [locations, setLocations] = useState<string[]>(['']);
    const [track, setTrack] = useState<string>('');
    const [tracks, setTracks] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const profileId = profile?.id || '';
    const adminId = ceramic?.did?.parent || '';
    const [uploading, setUploading] = useState(false);
    const inputFile = useRef<HTMLInputElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [blockClickModal, setBlockClickModal] = useState(false);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (
        name === 'participant' ||
        name === 'max_participant' ||
        name === 'min_participant'
      ) {
        if (!/^\d*$/.test(value)) {
          return;
        }
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
      append({ title: '', links: '' });
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

    const createEvent = async (formData: FormData) => {
      const { socialLinks } = formData;
      const isNeeded =
        inputs.name.length === 0 ||
        !startTime ||
        !endTime ||
        !spaceId ||
        !profileId;
      if (isNeeded) {
        typeof window !== 'undefined' &&
          window.alert('Please input all necessary fields.');
        return;
      } else {
        if (
          !descriptionEditorStore.value ||
          !descriptionEditorStore.value.blocks ||
          descriptionEditorStore.value.blocks.length == 0
        ) {
          setError(true);
          return;
        }

        try {
          setLoading(true);
          setBlockClickModal(true);
          const eventCreationInput: CreateEventRequest = {
            name: inputs.name,
            strDesc: descriptionEditorStore.getValueString(),
            tagline: inputs.tagline,
            spaceId: spaceId,
            profileId: profileId,
            avatarURL:
              avatarUploader.getUrl() ||
              'https://bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
            startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
            endTime: endTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
            socialLinks: socialLinks ?? [],
            participant: inputs.participant,
            max_participant: inputs.max_participant,
            min_participant: inputs.min_participant,
            tracks: tracks,
            adminId: adminId,
            external_url: inputs.external_url,
            person: person,
            locations: locations,
            timezone: selectedTimezone
              ? selectedTimezone.value
              : dayjs.tz.guess(),
          };
          /*const update: any = await composeClient.executeQuery(
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
               superAdmin{
               id
               }
               external_url
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
                  image_url:
                    avatarUploader.getUrl() ||
                    'https://bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
                  createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  endTime: endTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  customLinks: socialLinks,
                  participant_count: inputs.participant,
                  max_participant: inputs.max_participant,
                  min_participant: inputs.min_participant,
                  status: person ? 'In-Person' : 'Online',
                  tracks: tracks.join(','),
                  superAdmin: adminId,
                  external_url: inputs.external_url,
                },
              },
            },
          );
          const { data } = await supabase.from('locations').insert({
            name: locations.join(','),
            eventId: update.data.createEvent.document.id,
          });
          toggleDrawer('right', false);
          setReload((prev) => !prev);

          typeof window !== 'undefined' &&
            window.alert(
              'Submitted! Create process probably complete after few minute. Please check it in Space List page.',
            );*/

          const response = await createEventKeySupa(eventCreationInput);
          if (response.status === 200) {
            setShowModal(true);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
          setBlockClickModal(false);
        }
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          title="Event Created"
          message="Please view it."
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            getSpaceByID();
            handleClose();
          }}
          onConfirm={() => {
            setShowModal(false);
            getSpaceByID();
            handleClose();
          }}
        />
        <Dialog
          showModal={blockClickModal}
          showActions={false}
          title="Creating Event"
          message="Please wait while the event is being created..."
        />
        <Box
          sx={{
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '762px',
            backgroundColor: '#222222',
          }}
          role="presentation"
          zIndex="10"
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
              onClick={() => handleClose()}
              sx={{
                backgroundColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Close
            </ZuButton>
            <Typography variant="subtitleSB">Create Event</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#262626" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <FormTitle>Event Basic</FormTitle>
              </Box>
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
                <Stack spacing="10px">
                  <FormLabel>Event Name</FormLabel>
                  <ZuInput
                    onChange={handleInputChange}
                    name="name"
                    placeholder="Type an awesome name"
                  />
                </Stack>
                <Stack spacing="10px">
                  <FormLabel>Event Tagline</FormLabel>
                  <ZuInput
                    onChange={handleInputChange}
                    name="tagline"
                    placeholder="Write a short, one-sentence tagline for your event"
                  />
                </Stack>
                <Stack spacing="10px">
                  <FormLabel>Event Description</FormLabel>
                  <FormLabelDesc>
                    This is a description greeting for new members. You can also
                    update descriptions.
                  </FormLabelDesc>
                  <SuperEditor
                    value={descriptionEditorStore.value}
                    onChange={(val) => {
                      descriptionEditorStore.setValue(val);
                    }}
                  />
                  <Stack direction="row" justifyContent="flex-end">
                    <Typography variant="caption" color="white">
                      {5000 - descriptionEditorStore.length} Characters Left
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Stack spacing="10px" padding="20px">
                <FormLabel>Event Image</FormLabel>
                <FormLabelDesc>
                  Recommend min of 200x200px (1:1 Ratio)
                </FormLabelDesc>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Uploader3
                    accept={['.gif', '.jpeg', '.gif', '.png']}
                    api={'/api/file/upload'}
                    multiple={false}
                    crop={{
                      size: { width: 400, height: 400 },
                      aspectRatio: 1,
                    }} // must be false when accept is svg
                    onUpload={(file) => {
                      avatarUploader.setFile(file);
                    }}
                    onComplete={(file) => {
                      avatarUploader.setFile(file);
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
                      Upload Image
                    </Button>
                  </Uploader3>
                  <PreviewFile
                    sx={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                    }}
                    src={avatarUploader.getUrl()}
                    errorMessage={avatarUploader.errorMessage()}
                    isLoading={avatarUploader.isLoading()}
                  />
                </Box>
              </Stack>
              <Stack spacing="10px" padding="20px">
                <Box display="flex" justifyContent="space-between" gap="20px">
                  <Stack flex={1} spacing="10px">
                    <FormLabel>Start Date</FormLabel>
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
                  </Stack>
                  <Stack flex={1} spacing="10px">
                    <FormLabel>End Date</FormLabel>
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
                  </Stack>
                </Box>
                <Stack spacing={'10px'}>
                  <FormLabel>Timezone</FormLabel>
                  <TimezoneSelector
                    setSelectedTimezone={setSelectedTimezone}
                    sx={{
                      width: '100%',
                    }}
                  />
                </Stack>
              </Stack>
              <Stack spacing="10px" padding="20px">
                <FormLabel>External_URL</FormLabel>
                <ZuInput
                  onChange={handleInputChange}
                  type="string"
                  name="external_url"
                  placeholder="You can input the external URL "
                />
              </Stack>
              <Stack spacing="10px" padding="20px">
                <FormLabel>Participant</FormLabel>
                <ZuInput
                  value={inputs.participant}
                  onChange={handleInputChange}
                  type="number"
                  name="participant"
                  placeholder="Type Participant"
                />
              </Stack>
              <Stack spacing="10px" padding="20px">
                <FormLabel>Max Participant</FormLabel>
                <ZuInput
                  value={inputs.max_participant}
                  onChange={handleInputChange}
                  type="number"
                  name="max_participant"
                  placeholder="Type Max Participant"
                />
              </Stack>
              <Stack spacing="10px" padding="20px">
                <FormLabel>Min Participant</FormLabel>
                <ZuInput
                  value={inputs.min_participant}
                  onChange={handleInputChange}
                  type="number"
                  name="min_participant"
                  placeholder="Type Min Participant"
                />
              </Stack>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#262626" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <FormTitle>Event Format</FormTitle>
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
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={person} />
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
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={online} />
                    <Stack>
                      <Typography variant="bodyBB">Online</Typography>
                      <Typography variant="caption">
                        Specially Online Event
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
                <Stack spacing="10px">
                  <FormLabel>Location</FormLabel>
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
                  sx={{ fontWeight: 'bold' }}
                  size="medium"
                  endIcon={<PlusIcon size={4} />}
                  onClick={() => setLocations((prev) => [...prev, ''])}
                >
                  Add Address
                </ZuButton>
              </Box>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#262626" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <FormTitle>Links</FormTitle>
              </Box>
              <Box
                padding={'20px'}
                display={'flex'}
                flexDirection={'column'}
                gap={'30px'}
                ref={socialLinksRef}
              >
                {fields.map((item, index) => {
                  return (
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'20px'}
                      key={item.id}
                    >
                      <Box
                        display={'flex'}
                        flexDirection={'row'}
                        gap={'10px'}
                        flex={1}
                      >
                        <Typography
                          variant="subtitle2"
                          color="white"
                          sx={{ flex: 1 }}
                        >
                          Select Social
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="white"
                          sx={{ flex: 1, marginLeft: '-50px' }}
                        >
                          URL
                        </Typography>
                      </Box>
                      <Box
                        display={'flex'}
                        flexDirection={'row'}
                        gap={'10px'}
                        flex={1}
                      >
                        <Box flex={1}>
                          <Controller
                            name={`socialLinks.${index}.title`}
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                error={!!errors.socialLinks?.[index]?.title}
                              >
                                <Select
                                  {...field}
                                  labelId={`social-label-${index}`}
                                  label="Select"
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
                                  error={!!errors.socialLinks?.[index]?.title}
                                >
                                  {SOCIAL_TYPES.map((social, index) => {
                                    return (
                                      <MenuItem value={social.key} key={index}>
                                        {social.value}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                <FormHelperText>
                                  {errors.socialLinks?.[index]?.title?.message}
                                </FormHelperText>
                              </FormControl>
                            )}
                          />
                        </Box>
                        <Box flex={1}>
                          <Controller
                            name={`socialLinks.${index}.links`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                variant="outlined"
                                placeholder="https://"
                                sx={{
                                  '& > div > input': {
                                    padding: '8.5px 12px',
                                  },
                                }}
                                error={!!errors.socialLinks?.[index]?.links}
                                helperText={
                                  errors.socialLinks?.[index]?.links?.message
                                }
                              />
                            )}
                          />
                        </Box>
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'flex-end'}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => remove(index)}
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
                            <CancelIcon sx={{ fontSize: 20 }} />
                          </Box>
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
                  <Typography variant="buttonMSB" color="white">
                    Add Social Link
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#262626" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <FormTitle>Event Tracks</FormTitle>
              </Box>
              <Stack padding="20px" spacing="30px">
                <Typography variant="bodyB" color="text.secondary">
                  Tracks are the main categories for this event. This allows
                  sessions to be organized into relevant tracks by attributing
                  to a particular track.
                </Typography>
                <Stack spacing="20px">
                  <Stack spacing="10px">
                    <FormLabel>Event Tracks</FormLabel>
                    <FormLabelDesc>
                      Create tracks related to your event
                    </FormLabelDesc>
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
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box display="flex" gap="20px">
              <ZuButton
                sx={{
                  flex: 1,
                }}
                startIcon={<XMarkIcon size={5} />}
                onClick={handleClose}
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
                disabled={isLoading}
                onClick={handleSubmit(createEvent)}
              >
                Create Event
              </ZuButton>
            </Box>
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
        isAdmin={true}
      />
      <Box width="100%" borderLeft="1px solid #383838">
        <EventHeader />
        <CurrentEvents events={events} onToggle={toggleDrawer} />
        {/* <PastEvents /> */}
        <Invite />
        <SwipeableDrawer
          hideBackdrop={true}
          anchor="right"
          open={state['right']}
          onClose={() => toggleDrawer('right', false)}
          onOpen={() => toggleDrawer('right', true)}
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
        >
          {List('right')}
        </SwipeableDrawer>
      </Box>
    </Stack>
  );
};

export default Home;
