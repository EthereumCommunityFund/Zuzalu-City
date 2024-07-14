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
  Skeleton,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { Sidebar } from 'components/layout';
import SidebarLeft from './components/Sidebar';
import { EventCard, LotteryCard } from '@/components/cards';
// import SelectButton from '@/components/buttons/SelectButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCeramicContext } from '../../context/CeramicContext';
import { Event, EventData } from '@/types';
import { EventIcon, SearchIcon } from '@/components/icons';
import EventHeader from './components/EventHeader';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  groupEventsByMonth,
} from '@/components/cards/EventCard';

const EventsPage: React.FC = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState('Events');
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [events, setEvents] = useState<Event[]>([]);
  const [searchVal, setSearchVal] = useState('');
  const { composeClient } = useCeramicContext();

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
                name
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

  const onSearch = () => {
    getEvents();
  };

  useEffect(() => {
    if (searchVal) {
      debounceGetEventsCity();
    }
  }, [searchVal]);

  const debounceGetEventsCity = debounce(getEvents, 1000);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
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
            {/*<Box display={"flex"} position={"relative"} justifyContent={"end"}>*/}
            {/*    <SelectButton Icon={CalendarIcon} title={'Dates'} onOpened={() => setShowDate(true)} onClosed={() => setShowDate(false)} />*/}
            {/*    {showDate && <Box backgroundColor={"#222"} position={"absolute"} top={"40px"} padding={"10px"} borderRadius={"10px"} zIndex={"1000"} right={"0"}>*/}
            {/*        <Box*/}
            {/*            display="flex"*/}
            {/*            gap="4px"*/}
            {/*            padding="2px"*/}
            {/*            borderRadius="10px"*/}
            {/*            bgcolor="#2d2d2d"*/}
            {/*        >*/}
            {/*            <Button*/}
            {/*                sx={{*/}
            {/*                    flex: 1,*/}
            {/*                    backgroundColor: '#424242',*/}
            {/*                    borderRadius: '8px',*/}
            {/*                    color: 'white',*/}
            {/*                    fontFamily: 'Inter',*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                Upcoming*/}
            {/*            </Button>*/}
            {/*            <Button*/}
            {/*                sx={{*/}
            {/*                    flex: 1,*/}
            {/*                    backgroundColor: '#2d2d2d',*/}
            {/*                    borderRadius: '8px',*/}
            {/*                    color: 'white',*/}
            {/*                    fontFamily: 'Inter',*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                Past*/}
            {/*            </Button>*/}
            {/*        </Box>*/}
            {/*        <Box>*/}
            {/*            <ZuCalendar defaultValue={dayjs('2022-04-17')}/>*/}
            {/*        </Box>*/}
            {/*    </Box>}*/}
            {/*</Box>*/}
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
            {events?.length > 0 ? (
              Object.entries(groupEventsByMonth(events)).map(
                ([month, events], index) => {
                  return (
                    <div key={month + index}>
                      <EventCardMonthGroup>{month}</EventCardMonthGroup>
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
                            <EventCard
                              key={`EventCard-${index}`}
                              event={event}
                            />
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
              )
            ) : (
              <>
                <EventCardMonthGroup>
                  <Skeleton width={60}></Skeleton>
                </EventCardMonthGroup>
                <EventCardSkeleton />
                <EventCardSkeleton />
              </>
            )}
          </Stack>
        </Stack>
        <SidebarLeft
          onSearch={onSearch}
          onTextChange={(text) => setSearchVal(text)}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default EventsPage;
