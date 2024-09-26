import React, { useState, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  TextField,
  Chip,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimezoneSelector } from '@/components/select/TimezoneSelector';
import SuperEditor from '@/components/editor/SuperEditor';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { ZuButton, ZuInput } from 'components/core';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import { SOCIAL_TYPES } from '@/constant';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ITimezoneOption } from 'react-timezone-select';
import dayjs from 'dayjs';
import { CreateEventRequest } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { createEventKeySupa } from '@/services/event/createEvent';
import FormFooter from './FormFooter';
import FormHeader from './FormHeader';
import FormatCheckboxGroup from './FormatCheckbox';
import FormUploader from './FormUploader';
import { PlusIcon } from '../icons';

const schema = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  tagline: Yup.string().required('Event tagline is required'),
  description: Yup.string(),

  startTime: Yup.mixed().dayjs().required('Start date is required'),
  endTime: Yup.mixed().dayjs().required('End date is required'),
  timezone: Yup.object().shape({
    value: Yup.string(),
  }),
  external_url: Yup.string()
    .url('Must be a valid URL')
    .required('External URL is required'),
  imageUrl: Yup.string(),
  participant: Yup.number()
    .positive()
    .integer()
    .required('Participant number is required'),
  max_participant: Yup.number()
    .positive()
    .integer()
    .required('Max participant number is required'),
  min_participant: Yup.number()
    .positive()
    .integer()
    .required('Min participant number is required'),
  isPerson: Yup.boolean(),
  locations: Yup.array()
    .of(Yup.string().required('Location is required'))
    .min(1, 'At least one location is required'),
  socialLinks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Social media type is required'),
      links: Yup.string()
        .url('Must be a valid URL')
        .required('URL is required'),
    }),
  ),
  tracks: Yup.array(Yup.string().required('Track is required')).min(
    1,
    'At least one track is required',
  ),
});

type FormData = Yup.InferType<typeof schema>;

interface EventFormProps {
  spaceId: string;
  handleClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  spaceId,
  handleClose,
}) => {
  const [track, setTrack] = useState('');
  const descriptionEditorStore = useEditorStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      socialLinks: [{ title: '', links: '' }],
      locations: [''],
      isPerson: true,
      participant: 10,
      min_participant: 10,
      max_participant: 10,
      tracks: [],
    },
    shouldFocusError: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });
  const locations = watch('locations');
  const tracks = watch('tracks');
  const isPerson = watch('isPerson');

  const [isLoading, setLoading] = useState(false);
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { profile, ceramic } = useCeramicContext();
  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';

  const handleTrackChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTrack(e.target.value);
    },
    [],
  );

  const handleTrackKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (track) {
          setValue('tracks', [...(tracks || []), track]);
          setTrack('');
        }
      }
    },
    [setValue, track, tracks],
  );

  const handleTrackRemove = useCallback(
    (track: string) => {
      setValue(
        'tracks',
        (tracks || []).filter((item) => item !== track),
      );
    },
    [setValue, tracks],
  );

  const handleDescriptionChange = useCallback(
    (val: any) => {
      descriptionEditorStore.setValue(val);
    },
    [descriptionEditorStore],
  );

  const handleAddSocialLink = useCallback(() => {
    append({ title: '', links: '' });
  }, [append]);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      if (
        !descriptionEditorStore.value ||
        !descriptionEditorStore.value.blocks ||
        descriptionEditorStore.value.blocks.length == 0
      ) {
        setError('description', {
          message: 'Description is required',
        });
        window.alert('Description is required');
        return;
      }
      try {
        const {
          startTime,
          endTime,
          socialLinks,
          isPerson,
          timezone,
          external_url,
          tracks,
          locations,
          imageUrl,
        } = data;
        setBlockClickModal(true);
        setLoading(true);
        const eventCreationInput: CreateEventRequest = {
          ...data,
          strDesc: descriptionEditorStore.getValueString(),
          spaceId,
          profileId,
          externalUrl: external_url || '',
          imageUrl:
            imageUrl ||
            'https://bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
          startTime: startTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endTime: endTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          socialLinks: socialLinks ?? [],
          adminId,
          person: isPerson!,
          timezone: timezone ? timezone.value! : dayjs.tz.guess(),
          tracks: tracks || [],
          locations: locations || [],
        };

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
    },
    [adminId, descriptionEditorStore, profileId, setError, spaceId],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  const handleDialogClose = useCallback(() => {
    setShowModal(false);
    setBlockClickModal(false);
    handleClose();
  }, [handleClose]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        title="Event Created"
        message="Please view it."
        showModal={showModal}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
      />
      <Dialog
        showModal={blockClickModal}
        showActions={false}
        title="Creating Event"
        message="Please wait while the event is being created..."
      />
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="10"
        borderLeft="1px solid #383838"
      >
        <FormHeader title="Create Event" handleClose={handleClose} />
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
                <FormLabel>Event Name*</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <ZuInput
                        {...field}
                        placeholder="Type an awesome name"
                        error={!!error}
                      />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Event Tagline*</FormLabel>
                <Controller
                  name="tagline"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <ZuInput
                        {...field}
                        placeholder="Write a short, one-sentence tagline for your event"
                        error={!!error}
                      />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Event Description*</FormLabel>
                <FormLabelDesc>
                  This is a description greeting for new members. You can also
                  update descriptions.
                </FormLabelDesc>
                <SuperEditor
                  value={descriptionEditorStore.value}
                  onChange={handleDescriptionChange}
                />
                {errors?.description && (
                  <FormHelperText error>
                    {errors?.description.message}
                  </FormHelperText>
                )}
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
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => <FormUploader {...field} />}
              />
            </Stack>
            <Stack spacing="10px" padding="20px">
              <Box display="flex" justifyContent="space-between" gap="20px">
                <Stack flex={1} spacing="10px">
                  <FormLabel>Start Date*</FormLabel>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DesktopDatePicker {...field} />
                        {error && (
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Stack>
                <Stack flex={1} spacing="10px">
                  <FormLabel>End Date*</FormLabel>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DesktopDatePicker {...field} />
                        {error && (
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Stack>
              </Box>
              <Stack spacing={'10px'}>
                <FormLabel>Timezone</FormLabel>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <TimezoneSelector
                      value={field.value as ITimezoneOption}
                      setSelectedTimezone={(v) =>
                        setValue('timezone', v as ITimezoneOption)
                      }
                      sx={{
                        width: '100%',
                      }}
                    />
                  )}
                />
              </Stack>
            </Stack>
            <Stack spacing="10px" padding="20px">
              <FormLabel>External URL*</FormLabel>
              <Controller
                name="external_url"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ZuInput
                      {...field}
                      placeholder="You can input the external URL "
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Stack>
            {/*<Stack spacing="10px" padding="20px">
              <FormLabel>Participant*</FormLabel>
              <Controller
                name="participant"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ZuInput
                      {...field}
                      type="number"
                      placeholder="Type Participant"
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Stack>
            <Stack spacing="10px" padding="20px">
              <FormLabel>Max Participant*</FormLabel>
              <Controller
                name="max_participant"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ZuInput
                      {...field}
                      type="number"
                      placeholder="Type Max Participant"
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Stack>
            <Stack spacing="10px" padding="20px">
              <FormLabel>Min Participant*</FormLabel>
              <Controller
                name="min_participant"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ZuInput
                      {...field}
                      type="number"
                      placeholder="Type Min Participant"
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Stack>*/}
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
                <FormatCheckboxGroup
                  checked={!!isPerson}
                  handleChange={() => {
                    setValue('isPerson', !isPerson);
                  }}
                />
              </Box>
              <Stack spacing="10px">
                <FormLabel>Location*</FormLabel>
                {locations!.map((location, index) => (
                  <ZuInput
                    key={`Location_Index${index}`}
                    placeholder="city, country"
                    onChange={(e) => {
                      let newLocations = locations || [];
                      newLocations[index] = e.target.value;
                      setValue('locations', [...newLocations]);
                    }}
                  />
                ))}
                {errors.locations && (
                  <FormHelperText error>
                    {errors.locations[0]?.message}
                  </FormHelperText>
                )}
              </Stack>
              <ZuButton
                sx={{ fontWeight: 'bold' }}
                size="medium"
                endIcon={<PlusIcon size={4} />}
                onClick={() =>
                  setValue('locations', [...(locations || []), ''])
                }
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
                        Select Social*
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="white"
                        sx={{ flex: 1, marginLeft: '-50px' }}
                      >
                        URL*
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
                        justifyContent={'flex-start'}
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
                sessions to be organized into relevant tracks by attributing to
                a particular track.
              </Typography>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <FormLabel>Event Tracks*</FormLabel>
                  <FormLabelDesc>
                    Create tracks related to your event, press ENTER to add tags
                  </FormLabelDesc>
                </Stack>
                <ZuInput
                  placeholder="Add a tag"
                  onKeyDown={handleTrackKeyPress}
                  onChange={handleTrackChange}
                  value={track}
                />
                {errors.tracks && (
                  <FormHelperText error>{errors.tracks.message}</FormHelperText>
                )}
                <Stack direction="row" spacing="10px">
                  {(tracks || []).length !== 0 &&
                    (tracks || []).map((track, index) => (
                      <Chip
                        key={`TrackChip-${index}`}
                        label={track}
                        sx={{
                          borderRadius: '10px',
                          bgcolor: '#313131',
                        }}
                        onDelete={() => handleTrackRemove(track!)}
                      />
                    ))}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px" padding={3}>
          <FormFooter
            confirmText="Create Event"
            disabled={isLoading}
            handleClose={handleClose}
            handleConfirm={handleSubmit(onFormSubmit, onFormError)}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
