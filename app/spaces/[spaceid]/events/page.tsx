'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Stack, Typography, Button } from '@mui/material';
import { Header, Sidebar, IconSidebar } from './components';
import { ZuButton } from 'components/core';
import { CalendarIcon, EventIcon, HomeIcon, ListIcon } from 'components/icons';
import { EventCard } from '@/components/cards';
import { MOCK_DATA } from 'mock';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, EventData, EventEdge } from '@/types';

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  console.log("spaceID", spaceId)

  const [events, setEvents] = useState<Event[]>([]);
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();

  const getEvents = async () => {
    console.log('Fetching events...');
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
        console.log("filter", fetchedEvents.filter(event => event.spaceId === spaceId))
        setEvents(fetchedEvents.filter(event => event.spaceId === spaceId));
        console.log('Events fetched:', fetchedEvents);
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
        const data = await getEvents();
        console.log(data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Stack direction="row">
      <IconSidebar />
      <Sidebar spaceId={spaceId} />
      <Stack flex={1}>
        <Header />
        <Stack direction="row" justifyContent="center">
          <Stack
            width="80%"
            direction="row"
            spacing={2}
            bgcolor="#2d2d2d"
            padding={1}
          >
            <ZuButton variant="contained">Create Event</ZuButton>
            <ZuButton
              variant="contained"
              onClick={() => router.push('/spaces/123/events/456/edit')}
            >
              Manage Event
            </ZuButton>
          </Stack>
        </Stack>
        <Stack paddingX={20} paddingY={1} spacing={3}>
          <Stack direction="row" justifyContent="end">
            <Stack
              width="content-fit"
              direction="row"
              padding="2px"
              borderRadius="10px"
              bgcolor="#2d2d2d"
            >
              <ZuButton
                startIcon={<ListIcon />}
                sx={{
                  backgroundColor: '#424242',
                  '& .MuiButton-startIcon': {
                    margin: 0,
                  },
                }}
              />
              <ZuButton
                startIcon={<EventIcon />}
                sx={{
                  backgroundColor: '#2d2d2d',
                }}
              />
            </Stack>
          </Stack>
          <Typography
            color="white"
            border="2px solid #383838"
            align="center"
            paddingY="8px"
            borderRadius="40px"
            variant="subtitleS"
          >
            October 2023
          </Typography>
        </Stack>
        <Stack paddingX={20}>
          {
            events.map((event, index) => (
              <EventCard key={`EventCard-${index}`} name={event.title} description={event.description} />
            ))
          }
          {/* <EventCard {...MOCK_DATA.events[0]} />
          <ZuButton startIcon={<CalendarIcon />}>Eth Imrpov</ZuButton>
          <EventCard {...MOCK_DATA.events[1]} />
          <Stack direction="row" spacing={1}>
            <ZuButton startIcon={<HomeIcon />}>
              12 side events around HackZuzalu ChiangMai
            </ZuButton>
            <ZuButton startIcon={<CalendarIcon />}>HackZuzalu</ZuButton>
          </Stack>
          <EventCard {...MOCK_DATA.events[2]} />
          <ZuButton startIcon={<CalendarIcon />}>ZuCity Meetings</ZuButton> */}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
