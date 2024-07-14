'use client';
import { useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Stack, Typography, Button, Skeleton } from '@mui/material';
import { Header, Sidebar, IconSidebar } from './components';
import { ZuButton } from 'components/core';
import {
  Cog6Icon,
  EventIcon,
  ListIcon,
  PlusCircleIcon,
} from 'components/icons';
import { EventCard } from '@/components/cards';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, EventData, Space, SpaceData } from '@/types';
import SubSidebar from '@/components/layout/Sidebar/SubSidebar';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterPastEvents,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [space, setSpace] = useState<Space>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
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

  const getSpace = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          spaceIndex(first: 20) {
            edges {
              node {
                id
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
              }
            }
          }
        }
      `);

      if ('spaceIndex' in response.data) {
        const spaceData: SpaceData = response.data as SpaceData;
        const fetchedSpaces: Space[] = spaceData.spaceIndex.edges.map(
          (edge) => edge.node,
        );
        setSpace(
          fetchedSpaces.filter(
            (space) => space.id === params.spaceid.toString(),
          )[0],
        );
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  const getEvents = async () => {
    setIsEventsLoading(true);
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
    setIsEventsLoading(false);
  };

  useEffect(() => {
    Promise.all([getSpace(), getEvents()]).catch((e) => {
      console.error('An error occurred:', e);
    });
  }, []);

  return (
    <Stack direction="row" height="calc(100vh - 50px)" width="100%">
      <IconSidebar />
      <SubSidebar
        title={space?.name}
        spaceId={params.spaceid.toString()}
        isAdmin={false}
      />
      <Stack
        flex={1}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Header />
        <Stack
          direction="row"
          spacing={2}
          padding={1}
          borderBottom="1px solid #383838"
          alignItems="center"
          sx={{
            position: 'sticky',
            top: 61,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 1,
          }}
        >
          <Typography variant="bodyMB">Admin:</Typography>
          <ZuButton
            startIcon={<PlusCircleIcon size={5} />}
            sx={{
              fontSize: '14px',
            }}
          >
            Create Event
          </ZuButton>
          <ZuButton
            startIcon={<Cog6Icon size={5} />}
            sx={{ fontSize: '14px' }}
            onClick={() => router.push(`/spaces/${spaceId}/adminevents`)}
          >
            Manage Event
          </ZuButton>
        </Stack>

        {isEventsLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px',
            }}
          >
            <Typography variant="subtitleSB">Upcoming Events</Typography>
            <EventCardMonthGroup bgColor={'transparent'}>
              <Skeleton width={60}></Skeleton>
            </EventCardMonthGroup>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <Typography variant="subtitleSB">Past Events</Typography>
            <EventCardMonthGroup bgColor={'transparent'}>
              <Skeleton width={60}></Skeleton>
            </EventCardMonthGroup>
            <EventCardSkeleton />
            <EventCardSkeleton />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px',
            }}
          >
            {Object.entries(
              groupEventsByMonth(filterUpcomingEvents(events)),
            ).map(([month, eventsList]) => {
              return (
                <Fragment key={month}>
                  <Typography variant="subtitleSB">
                    Upcoming Events ({filterUpcomingEvents(events).length})
                  </Typography>
                  <EventCardMonthGroup bgColor={'transparent'}>
                    {month}
                  </EventCardMonthGroup>
                  {eventsList.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </Fragment>
              );
            })}
            <Typography variant="subtitleSB">
              Past Events ({filterPastEvents(events).length})
            </Typography>
            {filterPastEvents(events).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Home;
