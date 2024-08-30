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

  const { composeClient } = useCeramicContext();

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
            min_participant
            max_participant
            participant_count
            tracks
            customLinks {
              title
              links
            }
            space {
              name
              gated
            }
            contractID
            id
            contracts {
              contractAddress
              description
              image_url
              status
              type
            }
          }
        }
      }
    `;

    const variable = {
      id,
    };

    try {
      const result: any = await composeClient.executeQuery(query, variable);
      if (result.data) {
        if (result.data.node) {
          setEvent(result.data.node);
        }
      }
    } catch (err) {
      console.log('ERROR: FETCH EVENT: ', err);
    }
  };

  const isMobile = useMediaQuery('(max-width:768px)');

  const refetchData = () => {
    pathname.eventid && fetchEventById(pathname.eventid as string);
  };

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview event={event} refetch={refetchData} />;
      case 'Tickets':
        return <Ticket event={event} />;
      /*case 'Event Sessions':
        return <Sessions />;*/
      case 'Venue':
        return <Venue event={event} />;
      default:
        return <Overview />;
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (pathname.eventid) {
          fetchEventById(pathname.eventid as string);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Stack width="100%">
      <Navbar spaceName={event?.space?.name} />
      <Tabbar tabName={tabName} setTabName={setTabName} />
      <Stack direction="row" justifyContent="center">
        <Box width={isMobile ? '100%' : '860px'} marginTop={3}>
          {renderPage()}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
