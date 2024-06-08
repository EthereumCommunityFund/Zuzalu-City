'use client';
import * as React from 'react';
import { Stack, Grid } from '@mui/material';
import {
  EventName,
  EventDetail,
  EventRegister,
  EventAbout,
} from 'components/event';
import { useParams } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { CeramicResponseType, EventEdge, Event } from '@/types';

const About = () => {
  const [eventData, setEventData] = React.useState<Event>();

  const params = useParams();
  const eventId = params.eventid.toString();

  const { composeClient } = useCeramicContext();

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on Event {
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
              space {
                name
                gated
              }
            }
          }
        }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
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
  }, []);
  return eventData ? (
    <Stack padding="40px" direction="row" justifyContent="center">
      <Stack width={'900px'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <EventName
              endTime={eventData.endTime}
              startTime={eventData.startTime}
              eventDescription={eventData.description}
              spaceName={eventData.space?.name}
              eventName={eventData.title}
              location=""
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <EventRegister />
          </Grid>
          <Grid item xs={12} md={7}>
            <EventAbout />
          </Grid>
          <Grid item xs={12} md={5}>
            <EventDetail />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};

export default About;
