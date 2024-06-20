'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Grid,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { Sidebar } from 'components/layout';
import SidebarLeft from './components/Sidebar';
import { EventCard, LotteryCard } from '@/components/cards';
import SelectButton from '@/components/buttons/SelectButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCeramicContext } from '../../context/CeramicContext';
import { Event, EventData } from '@/types';
import { EventIcon, SearchIcon, CalendarIcon } from '@/components/icons';
import EventHeader from './components/EventHeader';
import { groupEventsByMonth } from '@/components/cards/EventCard';
import dayjs, { Dayjs } from 'dayjs';
import SlotDates from '@/components/calendar/SlotDate';
import { ZuCalendar } from '@/components/core';
import * as util from '@/utils';

const InitalDate = dayjs(
  new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
);

const EventsPage: React.FC = () => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [selected, setSelected] = useState('Events');
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [events, setEvents] = useState<Event[] | any[]>([]);
  const [searchVal, setSearchVal] = useState('');
  const { composeClient } = useCeramicContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [dateForCalendar, setDateForCalendar] = useState<Dayjs | null>(null);

  const handleMonthChange = (date: Dayjs | null) => {
    // console.log('date: ', date.endOf('month').toISOString());
    setDateForCalendar(date);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const isMobileEnv: boolean = util.isMobile();
    setIsMobile(isMobileEnv);
  }, []);

  const getEventsInMonth = async () => {
    try {
      const getEventsByDate_QUERY = `
        query ($input:EventFiltersInput!) {
        eventIndex(filters:$input, first: 20){
          edges {
            node {
              description
              external_url
              gated
              image_url
              max_participant
              meeting_url
              min_participant
              participant_count
              profileId
              spaceId
              status
              tagline
              timezone
              title
              profile {
                username
                avatar
              }
              createdAt
              endTime
              id
              startTime
            }
          }
        }
      }
    `;
      const response: any = await composeClient.executeQuery(
        getEventsByDate_QUERY,
        {
          input: {
            where: {
              startTime: {
                lessThanOrEqualTo: dateForCalendar
                  ?.endOf('month')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]'),
                greaterThanOrEqualTo: dateForCalendar
                  ?.startOf('month')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]'),
              },
            },
          },
        },
      );
      if (response && response.data && 'eventIndex' in response.data) {
        const eventData: EventData = response.data as EventData;
        const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
          (edge) => edge.node,
        );
        setEvents(fetchedEvents);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
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
        const searchedEvents: Event[] = fetchedEvents.filter((item) => {
          return item?.title.toLowerCase().includes(searchVal?.toLowerCase());
        });
        if (searchedEvents?.length > 0) {
          setEvents(searchedEvents);
        } else {
          setEvents(fetchedEvents);
        }
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsByDate = async () => {
    try {
      if (selectedDate) {
        let currentDate = new Date(
          selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
        );

        const timeDiff = selectedDate.utcOffset();
        if (timeDiff < 0) {
          currentDate = new Date(
            new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).getTime() -
              (24 * 60 * 60 * 1000 + timeDiff * 60 * 1000),
          );
        } else {
          currentDate = new Date(
            new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).getTime() -
              timeDiff * 60 * 1000,
          );
        }
        const utcYear = currentDate.getFullYear();
        const uctMM =
          String(currentDate.getMonth() + 1).length === 1
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1;
        const utcDD =
          String(currentDate.getDate() + 1).length === 1
            ? `0${currentDate.getDate() + 1}`
            : currentDate.getDate() + 1;
        const utcHH =
          String(currentDate.getHours()).length === 1
            ? `0${currentDate.getHours()}`
            : currentDate.getHours();
        const utcMM =
          String(currentDate.getMinutes()).length === 1
            ? `0${currentDate.getMinutes()}`
            : currentDate.getMinutes();
        const utcSS =
          String(currentDate.getSeconds()).length === 1
            ? `0${currentDate.getSeconds()}`
            : currentDate.getSeconds();
        console.log(
          'selectedDate: ',
          selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          `${utcYear}-${uctMM}-${utcDD}T${utcHH}:${utcMM}:${utcSS}Z`,
        );
        const getEventsByDate_QUERY = `
          query ($input:EventFiltersInput!) {
          eventIndex(filters:$input, first: 20){
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
                profile {
                  username
                  avatar
                }
              }
            }
          }
        }
      `;
        const response: any = await composeClient.executeQuery(
          getEventsByDate_QUERY,
          {
            input: {
              where: {
                startTime: {
                  equalTo: `${utcYear}-${uctMM}-${utcDD}T${utcHH}:${utcMM}:${utcSS}Z`,
                },
              },
            },
          },
        );
        if (response && response.data && 'eventIndex' in response.data) {
          const eventData: EventData = response.data as EventData;
          const fetchedEvents: Event[] = eventData.eventIndex.edges.map(
            (edge) => edge.node,
          );
          console.log('fetchEvents: ', fetchedEvents);
          setEvents(fetchedEvents);
        } else {
          console.error('Invalid data structure:', response.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEvents();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEventsByDate();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (getEventsInMonth) {
      getEventsInMonth();
    }
  }, [dateForCalendar]);

  const onSearch = () => {
    setSelectedDate(null);
    setDateForCalendar(null);
    getEvents();
  };

  useEffect(() => {
    if (searchVal) {
      setSelectedDate(null);
      setDateForCalendar(null);
      debounceGetEventsCity();
    }
  }, [searchVal]);

  const debounceGetEventsCity = debounce(getEvents, 800);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction="row"
        sx={{ backgroundColor: '#222222' }}
        minHeight={'100vh'}
      >
        {!isTablet && <Sidebar selected={selected} />}
        <Stack direction="column" borderLeft="1px solid #383838" flex={1}>
          <EventHeader />
          <Box
            display="flex"
            padding={'0 20px'}
            margin={'20px 0 0 0'}
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap="10px">
              <EventIcon />
              <Typography color="white" variant="subtitleLB">
                Events
              </Typography>
            </Box>
            <Box display={'flex'} position={'relative'} justifyContent={'end'}>
              {isMobile && (
                <SelectButton
                  Icon={CalendarIcon}
                  title={'Dates'}
                  onOpened={() => setShowDate(true)}
                  onClosed={() => setShowDate(false)}
                />
              )}
              {showDate && (
                <Box
                  bgcolor={'#222'}
                  position={'absolute'}
                  top={'40px'}
                  padding={'10px'}
                  borderRadius={'10px'}
                  zIndex={'1000'}
                  right={'0'}
                >
                  {/*<Box*/}
                  {/*    display="flex"*/}
                  {/*    gap="4px"*/}
                  {/*    padding="2px"*/}
                  {/*    borderRadius="10px"*/}
                  {/*    bgcolor="#2d2d2d"*/}
                  {/*>*/}
                  {/*    <Button*/}
                  {/*        sx={{*/}
                  {/*            flex: 1,*/}
                  {/*            backgroundColor: '#424242',*/}
                  {/*            borderRadius: '8px',*/}
                  {/*            color: 'white',*/}
                  {/*            fontFamily: 'Inter',*/}
                  {/*        }}*/}
                  {/*    >*/}
                  {/*        Upcoming*/}
                  {/*    </Button>*/}
                  {/*    <Button*/}
                  {/*        sx={{*/}
                  {/*            flex: 1,*/}
                  {/*            backgroundColor: '#2d2d2d',*/}
                  {/*            borderRadius: '8px',*/}
                  {/*            color: 'white',*/}
                  {/*            fontFamily: 'Inter',*/}
                  {/*        }}*/}
                  {/*    >*/}
                  {/*        Past*/}
                  {/*    </Button>*/}
                  {/*</Box>*/}
                  <Box>
                    <ZuCalendar
                      value={selectedDate ?? InitalDate}
                      onChange={(val) => {
                        // console.log('val: ', val);
                        handleDateChange(val);
                        setShowDate(false);
                      }}
                      slots={{
                        day: SlotDates,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays: events.map((event) => {
                            return new Date(event?.startTime).getDate();
                          }),
                        } as any,
                      }}
                      onMonthChange={(val) => {
                        handleMonthChange(val);
                        setShowDate(false);
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Stack
            sx={{
              display: 'none',
              flexDirection: 'column',
              gap: '10px',
              [theme.breakpoints.down('md')]: {
                display: 'flex',
              },
              padding: '0 20px',
            }}
          >
            <OutlinedInput
              placeholder="Search Events"
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  onSearch();
                }
              }}
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
              onChange={(e) => setSearchVal(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ opacity: 0.6 }}>
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              rowGap: '30px',
              columnGap: '40px',
              padding: '20px',
              justifyContent: 'center',
            }}
          >
            {Object.entries(groupEventsByMonth(events)).map(
              ([month, events], index) => {
                return (
                  <div key={month + index}>
                    <Typography
                      sx={{
                        position: 'sticky',
                        top: 60,
                      }}
                      display="block"
                      color="white"
                      border="1px solid #383838"
                      align="center"
                      paddingY="8px"
                      borderRadius="40px"
                      variant="subtitleS"
                      bgcolor="rgba(34, 34, 34, 0.8)"
                    >
                      {month}
                    </Typography>
                    <br />
                    <Box>
                      {events.map((event, index) => (
                        <Grid
                          item
                          key={`EventHeader-Card${index}`}
                          xs={12}
                          sm={6}
                          md={4}
                          xl={3}
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <EventCard key={`EventCard-${index}`} event={event} />
                        </Grid>
                      ))}
                      {/*<Grid*/}
                      {/*  key={`Lottery-Card`}*/}
                      {/*  xs={12}*/}
                      {/*  sm={6}*/}
                      {/*  md={4}*/}
                      {/*  xl={3}*/}
                      {/*  sx={{ display: 'flex', justifyContent: 'center' }}*/}
                      {/*>*/}
                      {/*  <LotteryCard />*/}
                      {/*</Grid>*/}
                    </Box>
                  </div>
                );
              },
            )}
          </Stack>
        </Stack>
        <SidebarLeft
          onSearch={onSearch}
          events={events}
          handleMonthChange={handleMonthChange}
          handleDateChange={handleDateChange}
          selectedDate={selectedDate}
          onTextChange={(text) => setSearchVal(text)}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default EventsPage;
