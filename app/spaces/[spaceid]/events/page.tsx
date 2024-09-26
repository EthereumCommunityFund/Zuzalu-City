'use client';
import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'next/navigation';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { EventCard } from '@/components/cards';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, Space, SpaceEventData } from '@/types';
import SubSidebar from '@/components/layout/Sidebar/SubSidebar';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterPastEvents,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';

const Home = () => {
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [space, setSpace] = useState<Space>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const { composeClient, ceramic } = useCeramicContext();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const getSpaceByID = async () => {
    setIsEventsLoading(true);
    const GET_SPACE_QUERY = `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
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
            admins {
              id
            }
            superAdmin {
              id
            }
            events(first: 10) {
              edges {
                node {
                  createdAt
                  description
              endTime
              timezone
              status
              tagline
              imageUrl
              externalUrl
              gated
              id
              meetingUrl
              profileId
              spaceId
              startTime
              title
              space {
                avatar
                name
              }
                }
              }
            }
          }
        }
      }
      `;

    const response: any = await composeClient.executeQuery(GET_SPACE_QUERY, {
      id: spaceId,
    });
    const spaceData: Space = response.data.node as Space;
    setSpace(spaceData);
    const eventData: SpaceEventData = response.data.node
      .events as SpaceEventData;
    const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
    setEvents(fetchedEvents);
    return spaceData;
  };
  useEffect(() => {
    const fetchData = async () => {
      const space = await getSpaceByID();
      document.title = space?.name + ' - ' + 'Zuzalu City';
      const admins =
        space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
        [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
    };

    fetchData()
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, []);

  return (
    <Stack direction="row" height="calc(100vh - 50px)" width="100%">
      <SubSidebar
        title={space?.name}
        spaceId={params.spaceid.toString()}
        isAdmin={isAdmin}
      />
      <Stack
        flex={1}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
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
