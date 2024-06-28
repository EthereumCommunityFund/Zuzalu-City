'use client';
import React, { useEffect, useState } from 'react';
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
  Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { PreviewFile } from '@/components';
import { createConnector } from '@lxdao/uploader3-connector';
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

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
}

type AvailableType = {
  startTime: string,
  endTime: string
}

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
  const [venues, setVenues] = useState<Venue[]>([]);

  const handleChange = (e: any) => {
    setTags(
      typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
    );
  }

  const [avatar, setAvatar] = useState<SelectedFile>();
  const [avatarURL, setAvatarURL] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>('');

  const connector = createConnector('NFT.storage', {
    token: process.env.NEXT_PUBLIC_CONNECTOR_TOKEN ?? '',
  });

  const getVenues = async () => {
    try {
      const { data } = await supabase.from('venues').select('*').eq('eventId', eventId);
      if (data) {
        const searchedVenues: Venue[] = data.filter((item, i) => item.name.toLowerCase().includes(searchValue.toLowerCase()));
        if (searchedVenues.length > 0) {
          setVenues(searchedVenues);
        }
        else {
          setVenues(data);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getVenues();
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue) {
      debounceGetEventsCity();
    }
  }, [searchValue]);

  const debounceGetEventsCity = debounce(getVenues, 1000);

  const List = (anchor: Anchor) => {
    const [monday, setMonday] = useState<AvailableType[]>([{
      startTime: '',
      endTime: ''
    }]);
    const [tuesday, setTuesday] = useState<AvailableType[]>([{
      startTime: '',
      endTime: ''
    }]);
    const [wednesday, setWednesday] = useState<AvailableType[]>([{
      startTime: '',
      endTime: ''
    }]);
    const [thursday, setThursday] = useState<AvailableType[]>([{
      startTime: '',
      endTime: ''
    }]);
    const [friday, setFriday] = useState<AvailableType[]>([{
      startTime: '',
      endTime: ''
    }]);

    const createVenue = async () => {
      console.log("here")
      try {
        const bookings = {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday
        }
        const { data } = await supabase.from("venues").insert({
          name,
          tags: tags.join(','),
          eventId,
          avatar: avatarURL,
          bookings: JSON.stringify(bookings)
        })
        toggleDrawer('right', false);
        await getVenues();
      } catch (err) {
        console.log(err);
      }
    }

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
            <Typography variant="subtitleSB">Venue Spaces</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitleMB">Create a Venue</Typography>
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
              <Typography variant="subtitleMB">Venue Space Details</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Space Name*</Typography>
                <ZuInput placeholder="Standard Pass" onChange={(e) => setName(e.target.value)} />
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Space Tags</Typography>
                  <Typography variant="bodyS">
                    Search or create categories related to your space
                  </Typography>
                </Stack>
                <Box>
                  <Select
                    multiple
                    value={tags}
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222'
                        }
                      }
                    }}
                  >
                    {
                      VENUE_TAGS.map((tag, index) => {
                        return (
                          <MenuItem
                            value={tag.value}
                            key={index}
                          >
                            {
                              tag.label
                            }
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </Box>
                <Box display={'flex'} flexDirection={'row'} gap={'10px'} flexWrap={'wrap'}>
                  {
                    tags.map((tag, index) => {
                      return (
                        <Chip
                          label={VENUE_TAGS.find((item) => item.value === tag)?.label}
                          sx={{
                            borderRadius: '10px'
                          }}
                          onDelete={
                            () => {
                              const newArray = tags.filter((item) => item !== tag);
                              setTags(newArray)
                            }
                          }
                          key={index}
                        />
                      )
                    })
                  }
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
                    <Typography variant="bodyMB">
                      Live-stream Available
                    </Typography>
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
                    <Typography variant="bodyMB">External Venue</Typography>
                    <XMarkIcon size={4} />
                  </Stack>
                </Stack> */}
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Space Image</Typography>
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
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                    }}
                    file={avatarURL}
                  />
                </Box>
              </Stack>
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Available Bookings</Typography>
              <Typography variant="bodyBB">
                {/* Your event timeframe: Month, 00, 2024 - Month, 00, 2024 */}
                {`Your event timeframe: ${dayjs(event?.startTime).format('MMMM')}, ${dayjs(event?.startTime).date()}, ${dayjs(event?.startTime).year()} - ${dayjs(event?.endTime).format('MMMM')}, ${dayjs(event?.endTime).date()}, ${dayjs(event?.endTime).year()}`}
              </Typography>
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
                    {
                      monday.map((item, index) => (
                        <TimeRange key={`Monday-Item-${index}`} values={monday} setValues={setMonday} id={index} />
                      ))
                    }
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      setMonday(prev =>
                        [
                          ...prev,
                          {
                            startTime: '',
                            endTime: ''
                          }
                        ]
                      )
                    }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      const prev = [...monday];
                      prev.pop();
                      setMonday(prev)
                    }}>
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
                    {
                      tuesday.map((item, index) => (
                        <TimeRange key={`Tuesday-Item-${index}`} values={tuesday} setValues={setTuesday} id={index} />
                      ))
                    }
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      setTuesday(prev =>
                        [
                          ...prev,
                          {
                            startTime: '',
                            endTime: ''
                          }
                        ]
                      )
                    }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      const prev = [...tuesday];
                      prev.pop();
                      setTuesday(prev)
                    }}>
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
                    {
                      wednesday.map((item, index) => (
                        <TimeRange key={`Wednesday-Item-${index}`} values={wednesday} setValues={setWednesday} id={index} />
                      ))
                    }
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      setWednesday(prev =>
                        [
                          ...prev,
                          {
                            startTime: '',
                            endTime: ''
                          }
                        ]
                      )
                    }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      const prev = [...wednesday];
                      prev.pop();
                      setWednesday(prev)
                    }}>
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
                    {
                      thursday.map((item, index) => (
                        <TimeRange key={`Thursday-Item-${index}`} values={thursday} setValues={setThursday} id={index} />
                      ))
                    }
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      setThursday(prev =>
                        [
                          ...prev,
                          {
                            startTime: '',
                            endTime: ''
                          }
                        ]
                      )
                    }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      const prev = [...thursday];
                      prev.pop();
                      setThursday(prev)
                    }}>
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
                    {
                      friday.map((item, index) => (
                        <TimeRange key={`Friday-Item-${index}`} values={friday} setValues={setFriday} id={index} />
                      ))
                    }
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      setFriday(prev =>
                        [
                          ...prev,
                          {
                            startTime: '',
                            endTime: ''
                          }
                        ]
                      )
                    }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }} onClick={() => {
                      const prev = [...friday];
                      prev.pop();
                      setFriday(prev)
                    }}>
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
      <VenueList venues={venues} onToggle={toggleDrawer} setSearchValue={setSearchValue} />
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

export default Home;
