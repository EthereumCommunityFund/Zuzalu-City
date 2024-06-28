'use client';
import * as React from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';

import { Ticket, Overview, Sessions, Venue } from './Tabs';
import { Tabbar, Navbar } from 'components/layout';
import { useParams } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event } from '@/types';

const Home: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');
  const [event, setEvent] = React.useState<Event>();

  const {
    ceramic,
    composeClient,
    profile,
  } = useCeramicContext();

  const pathname = useParams();

  const fetchEventById = async (id: string) => {
    const query = `
      query FetchEvent($id: ID!) {
        node(id: $id) {
          ...on Event {
            title
            description
            status
            endTime
            spaceId
            tagline
            timezone
            createdAt
            image_url
            profile {
              avatar
              username
            }
            startTime
            description
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
    `;

    const variable = {
      id
    }

    try {
      const result: any = await composeClient.executeQuery(query, variable);
      console.log(result);
      if (result.data) {
        if (result.data.node) {
          setEvent(result.data.node);
        }
      }
    } catch (err) {
      console.log('ERROR: FETCH EVENT: ', err);
    }
  }


  const isMobile = useMediaQuery('(max-width:500px)');
  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview event={event} />;
      case 'Tickets':
        return <Ticket />;
      case 'Event Sessions':
        return <Sessions />;
      case 'Venue':
        return <Venue event={event} />;
      default:
        return <Overview />;
    }
  };

  React.useEffect(() => {
    if (pathname.eventid) {
      fetchEventById(pathname.eventid as string)
    }
  }, [])

  return (
    <Stack width="100%">
      <Navbar spaceName={event?.space?.name} />
      <Tabbar tabName={tabName} setTabName={setTabName} />
      <Stack direction="row" justifyContent="center">
        <Box width={isMobile ? '90%' : '60%'} marginTop={3}>
          {renderPage()}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
