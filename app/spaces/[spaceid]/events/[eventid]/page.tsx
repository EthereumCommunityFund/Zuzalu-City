'use client';
import * as React from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import { IconSidebar, Header, Thumb, Sidebar } from './components';
import {
  EventName,
  EventAbout,
  EventDetail,
  EventRegister,
} from 'components/event';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';

const Home = () => {
  const [tabName, setTabName] = React.useState<string>('About');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));
  const [eventData, setEventData] = React.useState<Event>()

  const params = useParams();
  const eventId = params.eventid.toString();

  const {
    composeClient
  } = useCeramicContext()

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> = await composeClient.executeQuery(`
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on Event {
              id
              title
              description
              status
              endTime
              spaceId
              tagline
              timezone
              createdAt
              image_url
              profileId
              startTime
              meeting_url
              external_url
              max_participant
              space {
                name
                gated
              }
            }
          }
        }
      `, {
        id: eventId
      }) as CeramicResponseType<EventEdge>;
      if (response.data) {
        if (response.data.node) {
          setEventData(response.data.node);
        }
      }

    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }

  };

  React.useEffect(() => {
    getEventDetailInfo();
  }, [])

  return (
    <Stack direction="row" width="100%">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && <Sidebar />}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header />
        <Thumb tabName={tabName} setTabName={setTabName} />
        <Stack padding="40px" justifyContent="center" alignItems="center">
          {
            eventData && <Stack width={900}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <EventName 
                    endTime={eventData.endTime} 
                    startTime={eventData.startTime} 
                    eventDescription={eventData.description} 
                    spaceName={eventData.space?.name} 
                    eventName={eventData.title}
                    location=''
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <EventRegister />
                </Grid>
                <Grid item xs={12} md={8}>
                  <EventAbout />
                </Grid>
                <Grid item xs={12} md={4}>
                  <EventDetail />
                </Grid>
              </Grid>
            </Stack>
          }

        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
