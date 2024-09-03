import {
  Stack,
  Box,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback, useEffect, useState } from 'react';
import { Event, AvailableType, Venue } from '@/types';
import { supabase } from '@/utils/supabase/client';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import BpCheckbox from '@/components/event/Checkbox';
import { ZuButton, ZuInput } from '@/components/core';
import { TimeRange } from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Venue/components';
import {
  XMarkIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
} from '@/components/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { VENUE_TAGS } from '@/constant';
import SelectCheckItem from '@/components/select/selectCheckItem';
import dayjs from 'dayjs';
import FormUploader from './FormUploader';
import { useUploaderPreview } from '../PreviewFile/useUploaderPreview';
import Dialog from '@/app/spaces/components/Modal/Dialog';

interface IVenue {
  venue: Venue;
  event: Event | undefined;
  handleClose: () => void;
  refetch: () => void;
}

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const VenueForm = ({ event, venue, refetch, handleClose }: IVenue) => {
  const [name, setName] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number>(0);
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const avatarUploader = useUploaderPreview();

  const [data, setData] = useState<AvailableType[][]>(
    Array.from({ length: 7 }, () => [
      {
        startTime: '',
        endTime: '',
      },
    ]),
  );

  const updateVenue = async () => {
    try {
      setLoading(true);
      setBlockClickModal(true);
      const bookings = {} as Record<string, AvailableType[]>;
      data.forEach((day, index) => {
        const label = days[index].toLowerCase();
        bookings[label] = day;
      });
      await supabase
        .from('venues')
        .update({
          name,
          tags: tags.join(','),
          avatar: avatarUploader.getUrl(),
          bookings: JSON.stringify(bookings),
          capacity,
          timezone: event?.timezone,
        })
        .eq('id', venue.id);
      setShowModal(true);
      refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setTags(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const handleDialogClose = useCallback(() => {
    setShowModal(false);
    setBlockClickModal(false);
    handleClose();
  }, [handleClose]);

  const renderDay = (day: AvailableType[], index: number) => {
    const label = days[index].toUpperCase().slice(0, 3);
    return (
      <Stack direction="row" spacing="20px" key={label}>
        <Stack direction="row" spacing="20px" alignItems="center" flex="1">
          <BpCheckbox />
          <Typography variant="bodyBB">{label}</Typography>
        </Stack>
        <Stack spacing="10px" flex="4">
          {day.map((item, i) => (
            <TimeRange
              key={`${label}-Item-${i}`}
              values={day}
              setValues={(v: any) => {
                const prev = [...data];
                prev[index] = v;
                setData(prev);
              }}
              id={i}
              timezone={event?.timezone as string}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing="20px" alignItems="center" flex="1">
          <Stack
            padding="10px"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              const prev = [...data];
              if (prev[index].filter((item) => item.error).length === 0) {
                setData((v) => {
                  const i = [...v];
                  i[index] = [...i[index], { startTime: '', endTime: '' }];
                  return i;
                });
              }
            }}
          >
            <PlusIcon size={5} />
          </Stack>
          <Stack
            padding="10px"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              const prev = [...data];
              prev[index].pop();
              setData(prev);
            }}
          >
            <MinusIcon size={5} />
          </Stack>
        </Stack>
      </Stack>
    );
  };

  useEffect(() => {
    setName(venue?.name);
    setTags(venue?.tags.split(','));
    setCapacity(venue?.capacity);
    avatarUploader.setUrl(venue?.avatar);
    try {
      const bookings = JSON.parse(venue?.bookings as string);
      const data = [] as AvailableType[][];
      Object.keys(bookings).forEach((item) => {
        const day = bookings[item];
        const index = days.indexOf(item);
        data[index] = day;
      });
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="100"
        borderLeft="1px solid #383838"
      >
        <Dialog
          title="Space Updated"
          message="Please view it."
          showModal={showModal}
          onClose={handleDialogClose}
          onConfirm={handleDialogClose}
        />
        <Dialog
          showModal={blockClickModal}
          showActions={false}
          title="Updating Space"
          message="Please wait while the event is being created..."
        />
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
            onClick={handleClose}
            sx={{
              backgroundColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Close
          </ZuButton>
          <Typography variant="subtitleSB">Venue Spaces</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px" padding={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormTitle>Edit a Venue</FormTitle>
          </Stack>
          <Stack
            direction={'column'}
            spacing="30px"
            bgcolor="#262626"
            padding="20px"
            borderRadius="10px"
          >
            <FormTitle>Venue Space Details</FormTitle>
            <Stack spacing="10px">
              <FormLabel>Space Name*</FormLabel>
              <ZuInput
                value={name}
                placeholder="Standard Pass"
                onChange={(e) => setName(e.target.value)}
              />
            </Stack>
            <Stack spacing="20px">
              <Stack spacing="10px">
                <FormLabel>Space Tags</FormLabel>
                <FormLabelDesc>
                  Search or create categories related to your space
                </FormLabelDesc>
              </Stack>
              <Box>
                <Select
                  multiple
                  value={tags}
                  style={{ width: '100%' }}
                  onChange={handleChange}
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
                  {VENUE_TAGS.map((tag, index) => {
                    return (
                      <MenuItem value={tag.value} key={index}>
                        <SelectCheckItem
                          label={tag.label}
                          isChecked={
                            tags.findIndex((item) => item === tag.value) > -1
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
                {tags.map((tag, index) => {
                  return (
                    <Chip
                      label={
                        VENUE_TAGS.find((item) => item.value === tag)?.label
                      }
                      sx={{
                        borderRadius: '10px',
                      }}
                      onDelete={() => {
                        const newArray = tags.filter((item) => item !== tag);
                        setTags(newArray);
                      }}
                      key={index}
                    />
                  );
                })}
              </Box>
            </Stack>
            <Stack spacing="10px">
              <FormLabel>Space Image</FormLabel>
              <FormLabelDesc>
                Recommend min of 200x200px (1:1 Ratio)
              </FormLabelDesc>
              <FormUploader
                onChange={(url) => {
                  avatarUploader.setUrl(url);
                }}
              />
            </Stack>
            <Stack spacing="10px">
              <FormLabel>Space Capacity*</FormLabel>
              <ZuInput
                value={capacity}
                type="number"
                onChange={(e) => setCapacity(Number(e.target.value))}
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
            <FormTitle>Available Bookings</FormTitle>
            <Typography variant="bodyBB" color="text.secondary">
              Your event timezone: {event?.timezone}
            </Typography>
            <Stack spacing="4px" direction={'row'}>
              <Typography variant="bodyBB" color="text.secondary">
                Your event timeframe:
              </Typography>

              <Typography variant="bodyBB">
                {`${dayjs(event?.startTime).format('MMMM')}, ${dayjs(event?.startTime).date()}, ${dayjs(event?.startTime).year()} - ${dayjs(event?.endTime).format('MMMM')}, ${dayjs(event?.endTime).date()}, ${dayjs(event?.endTime).year()}`}
              </Typography>
            </Stack>
            <Stack spacing="20px">
              {data.map((day, index) => renderDay(day, index))}
            </Stack>
          </Stack>
          <Box display="flex" gap="20px">
            <ZuButton
              sx={{
                flex: 1,
              }}
              startIcon={<XMarkIcon />}
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
              startIcon={<PlusCircleIcon color="#67DBFF" />}
              onClick={updateVenue}
              disabled={isLoading}
            >
              Edit Space
            </ZuButton>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default VenueForm;
