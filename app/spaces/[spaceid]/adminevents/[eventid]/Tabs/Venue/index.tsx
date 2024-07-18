'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  SwipeableDrawer,
  Box,
  Typography,
  OutlinedInput,
  Button,
  Select,
  MenuItem,
  Chip,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { PreviewFile } from '@/components';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import { VenueHeader, VenueList } from './components';
import {
  XMarkIcon,
  ArchiveBoxIcon,
  SearchIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
} from '@/components/icons';
import BpCheckbox from '@/components/event/Checkbox';
import { MOCK_DATA } from '@/mock';
import { ZuButton, ZuInput } from '@/components/core';
import { TimeRange } from './components';
import { supabase } from '@/utils/supabase/client';
import { VENUE_TAGS } from '@/constant';
import { Venue, Event } from '@/types';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import SelectCheckItem from '@/components/select/selectCheckItem';
import VisuallyHiddenInput from '@/components/input/VisuallyHiddenInput';
import Space from '@/app/spaces/space';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

type AvailableType = {
  startTime: string;
  endTime: string;
};

interface IVenue {
  event: Event | undefined;
}

const Home: React.FC<IVenue> = ({ event }) => {
  const params = useParams();
  const eventId = params.eventid.toString();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const [name, setName] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number>(0);
  const [venues, setVenues] = useState<Venue[]>([]);
  const validateTimeRanges = (ranges: AvailableType[]) => {
    const errors = ranges.map((range, index) => {
      const startTime = new Date(range.startTime).getTime();
      const endTime = new Date(range.endTime).getTime();

      if (startTime >= endTime) {
        return { ...range, error: 'Start time must be before end time' };
      }

      for (let i = 0; i < ranges.length; i++) {
        if (i !== index) {
          const otherStartTime = new Date(ranges[i].startTime).getTime();
          const otherEndTime = new Date(ranges[i].endTime).getTime();
          if (
            (startTime < otherEndTime && startTime >= otherStartTime) ||
            (endTime > otherStartTime && endTime <= otherEndTime)
          ) {
            return { ...range, error: 'Time ranges overlap' };
          }
        }
      }

      return { ...range, error: '' };
    });

    return errors;
  };
  const handleChange = (e: any) => {
    setTags(
      typeof e.target.value === 'string'
        ? e.target.value.split(',')
        : e.target.value,
    );
  };

  const [avatar, setAvatar] = useState<SelectedFile>();
  const [avatarURL, setAvatarURL] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set('file', fileToUpload);
      const res = await fetch('/api/pinata', {
        method: 'POST',
        body: data,
      });
      const resData = await res.json();
      setAvatarURL(resData.url);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const handleImageChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };
  const getVenues = async () => {
    try {
      const { data } = await supabase
        .from('venues')
        .select('*')
        .eq('eventId', eventId);
      if (data) {
        const searchedVenues: Venue[] = data.filter((item, i) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()),
        );
        if (searchedVenues.length > 0) {
          setVenues(searchedVenues);
        } else {
          setVenues(data);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getVenues();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue) {
      debounceGetEventsCity();
    }
  }, [searchValue]);

  const debounceGetEventsCity = debounce(getVenues, 1000);

  const List = (anchor: Anchor) => {
    const { breakpoints } = useTheme();

    const [monday, setMonday] = useState<AvailableType[]>([
      {
        startTime: '',
        endTime: '',
      },
    ]);
    const [tuesday, setTuesday] = useState<AvailableType[]>([
      {
        startTime: '',
        endTime: '',
      },
    ]);
    const [wednesday, setWednesday] = useState<AvailableType[]>([
      {
        startTime: '',
        endTime: '',
      },
    ]);
    const [thursday, setThursday] = useState<AvailableType[]>([
      {
        startTime: '',
        endTime: '',
      },
    ]);
    const [friday, setFriday] = useState<AvailableType[]>([
      {
        startTime: '',
        endTime: '',
      },
    ]);

    const createVenue = async () => {
      try {
        const bookings = {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
        };
        const { data } = await supabase.from('venues').insert({
          name,
          tags: tags.join(','),
          eventId,
          avatar: avatarURL,
          bookings: JSON.stringify(bookings),
          capacity,
        });
        toggleDrawer('right', false);
        await getVenues();
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
            backgroundColor: '#222222',
            [breakpoints.down('md')]: {
              width: '100%',
            },
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
            <Typography variant="subtitleSB">Venue Spaces</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormTitle>Create a Venue</FormTitle>
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Button
                    component="label"
                    tabIndex={-1}
                    disabled={uploading}
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                      width: '140px',
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Button>
                  <PreviewFile
                    sx={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                    }}
                    src={avatarURL}
                  />
                </Box>
              </Stack>
              <Stack spacing="10px">
                <FormLabel>Space Capacity*</FormLabel>
                <ZuInput
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
              <Stack spacing="4px" direction={'row'}>
                <Typography variant="bodyBB" color="text.secondary">
                  Your event timeframe:
                </Typography>
                <Typography variant="bodyBB">
                  {`${dayjs(event?.startTime).format('MMMM')}, ${dayjs(event?.startTime).date()}, ${dayjs(event?.startTime).year()} - ${dayjs(event?.endTime).format('MMMM')}, ${dayjs(event?.endTime).date()}, ${dayjs(event?.endTime).year()}`}
                </Typography>
              </Stack>
              <Stack spacing="20px">
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">MON</Typography>
                  </Stack>
                  <Stack spacing="10px" flex="4">
                    {monday.map((item, index) => (
                      <TimeRange
                        key={`Monday-Item-${index}`}
                        values={monday}
                        setValues={setMonday}
                        id={index}
                      />
                    ))}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setMonday((prev) =>
                          validateTimeRanges([
                            ...prev,
                            { startTime: '', endTime: '' },
                          ]),
                        );
                      }}
                    >
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const prev = [...monday];
                        prev.pop();
                        setMonday(validateTimeRanges(prev));
                      }}
                    >
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">TUE</Typography>
                  </Stack>
                  <Stack spacing="10px" flex="4">
                    {tuesday.map((item, index) => (
                      <TimeRange
                        key={`Tuesday-Item-${index}`}
                        values={tuesday}
                        setValues={setTuesday}
                        id={index}
                      />
                    ))}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setTuesday((prev) => [
                          ...prev,
                          {
                            startTime: '',
                            endTime: '',
                          },
                        ]);
                      }}
                    >
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const prev = [...tuesday];
                        prev.pop();
                        setTuesday(prev);
                      }}
                    >
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">WED</Typography>
                  </Stack>
                  <Stack spacing="10px" flex="4">
                    {wednesday.map((item, index) => (
                      <TimeRange
                        key={`Wednesday-Item-${index}`}
                        values={wednesday}
                        setValues={setWednesday}
                        id={index}
                      />
                    ))}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setWednesday((prev) => [
                          ...prev,
                          {
                            startTime: '',
                            endTime: '',
                          },
                        ]);
                      }}
                    >
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const prev = [...wednesday];
                        prev.pop();
                        setWednesday(prev);
                      }}
                    >
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">THU</Typography>
                  </Stack>
                  <Stack spacing="10px" flex="4">
                    {thursday.map((item, index) => (
                      <TimeRange
                        key={`Thursday-Item-${index}`}
                        values={thursday}
                        setValues={setThursday}
                        id={index}
                      />
                    ))}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setThursday((prev) => [
                          ...prev,
                          {
                            startTime: '',
                            endTime: '',
                          },
                        ]);
                      }}
                    >
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const prev = [...thursday];
                        prev.pop();
                        setThursday(prev);
                      }}
                    >
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">FRI</Typography>
                  </Stack>
                  <Stack spacing="10px" flex="4">
                    {friday.map((item, index) => (
                      <TimeRange
                        key={`Friday-Item-${index}`}
                        values={friday}
                        setValues={setFriday}
                        id={index}
                      />
                    ))}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFriday((prev) => [
                          ...prev,
                          {
                            startTime: '',
                            endTime: '',
                          },
                        ]);
                      }}
                    >
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack
                      padding="10px"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const prev = [...friday];
                        prev.pop();
                        setFriday(prev);
                      }}
                    >
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">SAT</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" flex="4">
                    <Typography>Unavailable</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">SUN</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" flex="4">
                    <Typography>Unavailable</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
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
                onClick={createVenue}
              >
                Add Space
              </ZuButton>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };

  return (
    <Stack spacing="30px" padding="30px">
      <VenueHeader onToggle={toggleDrawer} count={venues.length} />
      <VenueList
        venues={venues}
        onToggle={toggleDrawer}
        setSearchValue={setSearchValue}
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

export default Home;
