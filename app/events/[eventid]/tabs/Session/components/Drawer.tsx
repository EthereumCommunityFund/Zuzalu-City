import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks';
import { ZuInput, ZuSwitch } from '@/components/core';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Event, Profile, Session, SessionSupabaseData, Venue } from '@/types';
import SelectCategories from '@/components/select/selectCategories';
import { SuperEditor } from '@/components/editor/SuperEditor';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { EXPREIENCE_LEVEL_TYPES } from '@/constant';
import {
  FormItem,
  FormHeader,
  FormGroup,
  SessionLocationDisplay,
  SessionFormatCheckbox,
  SessionDateDisplay,
  FormFooter,
} from '@/components/form';
import useSessionTime from '@/hooks/useSessionTime';
import SelectSearchUser from '@/components/select/selectSearchUser';
import { useCeramicContext } from '@/context/CeramicContext';
import dayjs from '@/utils/dayjs';
import { v4 as uuidv4 } from 'uuid';
import { supaCreateSession } from '@/services/session';
import { useParams } from 'next/navigation';
import Dialog from '@/app/spaces/components/Modal/Dialog';

interface IProps {
  eventData: Event;
  locations: string[];
  venues: Venue[];
  handleClose: () => void;
  bookedSessionsForDay: Session[];
  setBookedSessionsForDay: (session: Session[]) => void;
  people: Profile[];
  fetchAndFilterSessions: () => void;
}

Yup.addMethod(Yup.mixed, 'dayjs', function dayjsSchema() {
  return this.test(
    'is-dayjs',
    '${path} must be a valid Day.js object',
    function (value) {
      if (value === null || value === undefined) {
        return true;
      }
      return dayjs.isDayjs(value);
    },
  ).transform((value) => {
    return dayjs.isDayjs(value) ? value : dayjs(value);
  });
});

declare module 'yup' {
  interface MixedSchema<TType = any, TContext = any, TOut = any> {
    // @ts-ignore
    dayjs(): Yup.DateSchema<dayjs.Dayjs | null | undefined, TContext>;
  }
}

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  track: Yup.string().required('Track is required'),
  tags: Yup.array().of(Yup.string()),
  type: Yup.string(),
  experienceLevel: Yup.string(),
  liveStreamLink: Yup.string(),
  isPerson: Yup.boolean(),
  location: Yup.string().required('Location is required'),
  customLocation: Yup.string(),
  isDirections: Yup.boolean(),
  directions: Yup.string(),
  date: Yup.mixed().nullable().dayjs(),
  startTime: Yup.mixed().nullable().dayjs(),
  endTime: Yup.mixed().nullable().dayjs(),
  videoURL: Yup.string(),
  hiddenOrganizer: Yup.boolean(),
  organizers: Yup.array().min(1, 'Organizer is required'),
  speakers: Yup.array(),
});

type FormData = Yup.InferType<typeof schema>;

export const Drawer = ({
  eventData,
  locations,
  venues,
  handleClose,
  bookedSessionsForDay,
  setBookedSessionsForDay,
  people,
  fetchAndFilterSessions,
}: IProps) => {
  const { isMobile } = useMediaQuery();
  const sessionDescriptionEditorStore = useEditorStore();
  const { profile, isAuthenticated, ceramic } = useCeramicContext();
  const params = useParams();
  const eventId = params.eventid.toString();
  const profileId = profile?.id || '';
  const adminId = ceramic?.did?.parent || '';

  const [selectedRoom, setSelectedRoom] = useState<Venue>();
  const [showModal, setShowModal] = useState(false);
  const [blockClickModal, setBlockClickModal] = useState(false);

  const {
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isPerson: true,
    },
  });

  const isPerson = watch('isPerson');
  const hiddenOrganizer = watch('hiddenOrganizer');

  const { handleDateChange, isDateInRange, isTimeAvailable, isSessionOverlap } =
    useSessionTime({
      venues,
      eventData,
      control,
      setValue,
      bookedSessionsForDay,
      setBookedSessionsForDay,
    });

  const handleResetTime = useCallback(() => {
    setValue('date', null);
    setValue('startTime', null);
    setValue('endTime', null);
  }, [setValue]);

  const handleFormSubmit = useCallback(
    async (data: FormData) => {
      if (!isAuthenticated) {
        return;
      }

      let timezone = eventData?.timezone;
      const {
        isPerson,
        location,
        startTime,
        endTime,
        videoURL,
        customLocation,
        name,
        experienceLevel,
        type,
        tags,
        track,
        directions,
        organizers,
        speakers,
        liveStreamLink,
      } = data;

      const description = sessionDescriptionEditorStore.getValueString();
      const format = isPerson ? 'person' : 'online';

      const error =
        !eventId || !startTime || !description || !endTime || !profileId;

      if (error) {
        typeof window !== 'undefined' &&
          window.alert('Please fill necessary fields!');
        return;
      } else if (dayjs(endTime).utc() <= dayjs(startTime).utc()) {
        typeof window !== 'undefined' &&
          window.alert('Please check the input session time');
        return;
      } else if (
        isSessionOverlap(
          bookedSessionsForDay,
          dayjs(startTime).tz('UTC').tz(timezone),
          dayjs(endTime).tz('UTC').tz(timezone),
        )
      ) {
        typeof window !== 'undefined' &&
          window.alert('The new session overlaps with an existing session');
        return;
      }

      if (format === 'person') {
        if (location === 'Custom' && !customLocation) {
          typeof window !== 'undefined' &&
            window.alert('Please fill custom location field');
          return;
        }
        if (!location) {
          typeof window !== 'undefined' &&
            window.alert('Please fill location field');
          return;
        }
      } else {
        if (!videoURL) {
          typeof window !== 'undefined' &&
            window.alert('Please fill virtual location field');
          return;
        }
      }
      const formattedData: SessionSupabaseData = {
        title: name,
        description,
        experience_level: experienceLevel,
        createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
        startTime: startTime
          ? dayjs(startTime).utc().format('YYYY-MM-DDTHH:mm:ss[Z]').toString()
          : null,
        endTime: endTime
          ? dayjs(endTime).utc().format('YYYY-MM-DDTHH:mm:ss[Z]').toString()
          : null,
        profileId,
        eventId,
        tags: (tags || []).join(','),
        type: type,
        format,
        track,
        timezone: timezone,
        video_url: videoURL,
        location:
          location === 'Custom'
            ? `Custom Location: ${customLocation} ${directions}`
            : location,
        organizers: JSON.stringify(organizers),
        speakers: JSON.stringify(speakers),
        creatorDID: adminId,
        uuid: uuidv4(),
        liveStreamLink,
      };
      try {
        setBlockClickModal(true);
        const response = await supaCreateSession(formattedData);
        if (response.status === 200) {
          fetchAndFilterSessions();
          setShowModal(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setBlockClickModal(false);
      }
    },
    [
      adminId,
      bookedSessionsForDay,
      eventData?.timezone,
      eventId,
      fetchAndFilterSessions,
      isAuthenticated,
      isSessionOverlap,
      profileId,
      sessionDescriptionEditorStore,
    ],
  );

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      // @ts-ignore
      window.alert(errors[firstKey]?.message);
    }
  }, [errors]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        title="Session Created"
        message="Please view it."
        showModal={showModal}
        onClose={() => {
          handleClose();
          setShowModal(false);
        }}
        onConfirm={() => {
          fetchAndFilterSessions();
          handleClose();
          setShowModal(false);
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
          width: isMobile ? '100%' : '762px',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="100"
        borderLeft="1px solid #383838"
      >
        <FormHeader title="Create Session" handleClose={handleClose} />
        <Box display="flex" flexDirection="column" gap="20px" padding={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitleMB">Create a Session</Typography>
          </Stack>
          <FormGroup title="Session Details">
            <FormItem title="Session Name" required>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <ZuInput {...field} placeholder="Input a name" />
                )}
              />
            </FormItem>
            <FormItem
              title="Select a Track"
              desc="Attach a relevant track this session relates to"
              required
            >
              <Controller
                name="track"
                control={control}
                render={({ field }) => (
                  <Select {...field} input={<OutlinedInput label="Name" />}>
                    {eventData?.tracks?.split(',').map((i, index) => {
                      return (
                        <MenuItem value={i} key={`EventTrack_Index${index}`}>
                          {i}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
            </FormItem>
            <FormItem
              title="Session Tags"
              desc="Search or create categories related to your space"
            >
              <Controller
                name="tags"
                control={control}
                render={({ field }) => <SelectCategories {...field} />}
              />
            </FormItem>
            <FormItem
              title="Session Description"
              desc="Write an introduction for this session"
              required
            >
              <SuperEditor
                onChange={(val) => {
                  sessionDescriptionEditorStore.setValue(val);
                }}
              />
            </FormItem>
            <FormItem
              title="Session Type"
              desc="Choose a type for your session to relay its nature to guests"
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ZuInput
                    {...field}
                    placeholder="Meetup, Activity, Party, etc.."
                  />
                )}
              />
            </FormItem>
            <FormItem
              title="Experience Level"
              desc="Select a level experience may be needed for this session"
            >
              <Controller
                name="experienceLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    input={<OutlinedInput label="Experience_Level" />}
                  >
                    {EXPREIENCE_LEVEL_TYPES.map((i, index) => {
                      return (
                        <MenuItem value={i.key} key={`Speaker_Index${index}`}>
                          {i.value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
            </FormItem>
            <FormItem
              title="Live-Stream Link"
              desc="Enter a link for where this session will be streamed"
            >
              <Controller
                name="liveStreamLink"
                control={control}
                render={({ field }) => (
                  <ZuInput {...field} placeholder="https://" />
                )}
              />
            </FormItem>
          </FormGroup>
          <FormGroup title="Location & Booking">
            <Controller
              name="isPerson"
              control={control}
              render={({ field }) => (
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Session Format*</Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    gap="20px"
                    flexDirection={isMobile ? 'column' : 'row'}
                  >
                    <SessionFormatCheckbox
                      checked={!!field.value}
                      title="In-Person"
                      desc="This is a physical event"
                      handleChange={() => {
                        field.onChange(true);
                        handleResetTime();
                      }}
                    />
                    <SessionFormatCheckbox
                      checked={!field.value}
                      title="Online"
                      desc="Specially Online Event"
                      handleChange={() => {
                        field.onChange(false);
                        handleResetTime();
                      }}
                    />
                  </Box>
                </Stack>
              )}
            />
            <Stack spacing="30px">
              {isPerson ? (
                <>
                  <FormItem
                    title="Select Location"
                    desc="Book a location to host this session"
                    required
                  >
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => {
                        return (
                          <>
                            <Select
                              {...field}
                              onChange={(e) => {
                                const selectedRoom = venues.find(
                                  (item) => item.name === e.target.value,
                                );
                                handleResetTime();
                                setSelectedRoom(selectedRoom);
                                field.onChange(e.target.value);
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
                            <SessionLocationDisplay
                              selectedRoom={selectedRoom!}
                              control={control}
                            />
                          </>
                        );
                      }}
                    />
                  </FormItem>
                  <SessionDateDisplay
                    eventData={eventData}
                    control={control}
                    handleDateChange={handleDateChange}
                    isDateInRange={isDateInRange}
                    isTimeAvailable={isTimeAvailable}
                  />
                </>
              ) : (
                <>
                  <FormItem
                    title="Virtual Location"
                    desc="Provide a URL where this session will be hosted"
                  >
                    <div>
                      <Controller
                        name="videoURL"
                        control={control}
                        render={({ field }) => {
                          return <ZuInput {...field} placeholder="https://" />;
                        }}
                      />
                    </div>
                  </FormItem>
                  <SessionDateDisplay
                    eventData={eventData}
                    control={control}
                    handleDateChange={handleDateChange}
                    isDateInRange={isDateInRange}
                    isTimeAvailable={isTimeAvailable}
                  />
                </>
              )}
            </Stack>
          </FormGroup>
          <FormGroup title="Session Participants">
            <Stack direction="row" spacing="10px">
              <Controller
                name="hiddenOrganizer"
                control={control}
                render={({ field }) => {
                  return <ZuSwitch {...field} />;
                }}
              />
              <Stack spacing="10px">
                <Typography variant="bodyBB">
                  Hide yourself as an organizer for this session
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By default the creator of a session is listed as an organizer
                  of it
                </Typography>
              </Stack>
            </Stack>
            <FormItem title="Organizers" desc="Type or search a person">
              <Controller
                name="organizers"
                control={control}
                render={({ field }) => {
                  return (
                    <SelectSearchUser
                      {...field}
                      users={people}
                      initialUsers={[profile as Profile]}
                      fixedUsers={[profile as Profile]}
                      removedInitialUsers={hiddenOrganizer}
                    />
                  );
                }}
              />
            </FormItem>
            <FormItem
              title="Speakers"
              desc="Type or search a person"
              required={false}
            >
              <Controller
                name="speakers"
                control={control}
                render={({ field }) => {
                  return <SelectSearchUser {...field} users={people} />;
                }}
              />
            </FormItem>
          </FormGroup>
          <FormFooter
            confirmText="Add Session"
            handleClose={handleClose}
            handleConfirm={handleSubmit(handleFormSubmit)}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
