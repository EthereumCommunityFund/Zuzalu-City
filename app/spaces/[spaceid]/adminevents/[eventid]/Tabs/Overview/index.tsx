import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import { OverviewHeader, OverviewDetail, OverviewInvite } from './components';
import { CreateEventRequest, Event, UpdateEventRequest } from '@/types';
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { SelectedFile, Uploader3 } from '@lxdao/uploader3';
import { useUploaderPreview } from '@/components/PreviewFile/useUploaderPreview';
import {
  allTimezones,
  ITimezoneOption,
  useTimezoneSelect,
} from 'react-timezone-select';
import dayjs, { Dayjs } from 'dayjs';
import { createEventKeySupa } from '@/services/event/createEvent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { ZuButton, ZuInput } from '@/components/core';
import { PlusCircleIcon, PlusIcon, XMarkIcon } from '@/components/icons';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import SuperEditor from '@/components/editor/SuperEditor';
import { PreviewFile } from '@/components';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimezoneSelector } from '@/components/select/TimezoneSelector';
import BpCheckbox from '@/components/event/Checkbox';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { SOCIAL_TYPES } from '@/constant';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import timezone from 'dayjs/plugin/timezone';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { updateEventKeySupa } from '@/services/event/updateEvent';
import { createUrlWhenEdit } from '@/services/url';
import { covertNameToUrlName } from '@/utils/format';

dayjs.extend(timezone);

type FormData = Yup.InferType<typeof schema>;

interface Inputs {
  name: string;
  tagline: string;
  timezone: string;
  externalUrl: string;
}

interface PropTypes {
  event?: Event;
  refetch?: () => void;
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

const Overview = ({ event, refetch }: PropTypes) => {
  const { ceramic, profile, composeClient } = useCeramicContext();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [inputs, setInputs] = useState<Inputs>({
    name: '',
    tagline: '',
    timezone: '',
    externalUrl: 'TBD',
  });

  const descriptionEditorStore = useEditorStore();
  const avatarUploader = useUploaderPreview();
  const { options } = useTimezoneSelect({ timezones: allTimezones });
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezoneOption>(
    {} as ITimezoneOption,
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<string[]>(['']);
  const [track, setTrack] = useState<string>('');
  const [tracks, setTracks] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
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

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('eventId', event?.id);
      if (data !== null) {
        setLocations(data.map((item) => item.name));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (event) {
      getLocation();
      setInputs({
        name: event.title || '',
        tagline: event.tagline || '',
        timezone: event.timezone || '',
        externalUrl: event.externalUrl || 'TBD',
      });
      descriptionEditorStore.setValue(
        JSON.stringify(event.description)
          .slice(1, -1)
          .replace(/\\\\/g, '\\')
          .replace(/\\"/g, '"'),
      );
      avatarUploader.setUrl(event.imageUrl);
      setStartTime(dayjs(event.startTime));
      setEndTime(dayjs(event.endTime));
      setSelectedTimezone(
        options.find((item) => item.value === event.timezone) ||
          ({} as ITimezoneOption),
      );
      setPerson(event.status === 'In-Person');
      setOnline(event.status !== 'In-Person');
      setValue('socialLinks', event.customLinks);
      setTracks((event.tracks || '').split(','));
    }
  }, [event, options]);

  const List = (anchor: Anchor) => {
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

    const updateEvent = async (formData: FormData) => {
      if (!event) return;
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
      }
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
        const eventUpdateInput: UpdateEventRequest = {
          id: event.id,
          name: inputs.name,
          strDesc: descriptionEditorStore.getValueString(),
          tagline: inputs.tagline,
          spaceId: spaceId,
          profileId: profileId,
          imageUrl:
            avatarUploader.getUrl() ||
            'https://bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
          startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endTime: endTime?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          socialLinks: socialLinks ?? [],
          tracks: tracks,
          adminId: adminId,
          externalUrl: inputs.externalUrl,
          person: person,
          locations: locations,
          timezone: selectedTimezone
            ? selectedTimezone.value
            : dayjs.tz.guess(),
        };
        await updateEventKeySupa(eventUpdateInput);
        if (inputs.name !== event.title) {
          const urlName = covertNameToUrlName(inputs.name);
          await createUrlWhenEdit(urlName, event.id, 'events');
        }
        refetch?.();
        handleClose();
      } catch (error) {
        console.error('Failed to update event:', error);
      } finally {
        setLoading(false);
        setBlockClickModal(false);
      }
    };

    if (!event) return null;

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          title="Event Updated"
          message="Please view it."
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            handleClose();
          }}
          onConfirm={() => {
            setShowModal(false);
            handleClose();
          }}
        />
        <Dialog
          showModal={blockClickModal}
          showActions={false}
          title="Updating Event"
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
            <Typography variant="subtitleSB">Update Event</Typography>
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
                    value={inputs.name}
                    onChange={handleInputChange}
                    name="name"
                    placeholder="Type an awesome name"
                  />
                </Stack>
                <Stack spacing="10px">
                  <FormLabel>Event Tagline</FormLabel>
                  <ZuInput
                    value={inputs.tagline}
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
                      value={startTime}
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
                      value={endTime}
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
                    value={selectedTimezone}
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
                  value={inputs.externalUrl}
                  onChange={handleInputChange}
                  type="string"
                  name="external_url"
                  placeholder="You can input the external URL "
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
                      value={location}
                      key={`Location_Index${index}`}
                      placeholder="city, country"
                      onChange={(e) => {
                        let newLocations = locations;
                        newLocations[index] = e.target.value;
                        setLocations([...newLocations]);
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
                      Create tracks related to your event, press ENTER to add
                      tags
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
                onClick={handleSubmit(updateEvent)}
              >
                Update Event
              </ZuButton>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };
  return (
    <Stack direction="column" spacing={4} padding="0 30px 30px">
      <OverviewHeader event={event} />
      <OverviewDetail
        eventData={event}
        handleEditEvent={() => toggleDrawer('right', true)}
      />
      <OverviewInvite event={event} />
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
    </Stack>
  );
};

export default Overview;
