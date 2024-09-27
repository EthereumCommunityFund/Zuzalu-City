'use client';
import * as React from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';

import { Ticket, Overview, Venue, Announcements } from './Tabs';
import { Tabbar, Navbar } from 'components/layout';
import { useParams, useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, Space } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getSpacesQuery } from '@/services/space';

const Home: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');
  const [event, setEvent] = React.useState<Event>();

  const { composeClient, ceramic } = useCeramicContext();

  const pathname = useParams();
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceid.toString();

  const { data: spaceData } = useQuery({
    queryKey: ['getSpaceByID', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpacesQuery, {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  const fetchEventById = async (id: string) => {
    const query = `
      query FetchEvent($id: ID!) {
        node(id: $id) {
          ...on ZucityEvent {
            title
            description
            status
            endTime
            spaceId
            tagline
            timezone
            createdAt
            imageUrl
            profile {
              avatar
              username
            }
            startTime
            description
            meetingUrl
            externalUrl
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
              checkin
            }
            checkinPass
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

  const { refetch } = useQuery({
    queryKey: ['fetchEventById', pathname.eventid],
    queryFn: () => fetchEventById(pathname.eventid as string),
    enabled: !!pathname.eventid,
  });

  const refetchData = () => {
    pathname.eventid && refetch();
  };

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview event={event} refetch={refetchData} />;
      case 'Announcements':
        return <Announcements event={event} />;
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

  React.useEffect(() => {
    if (spaceData) {
      const superAdmins =
        spaceData?.superAdmin?.map((superAdmin) =>
          superAdmin.id.toLowerCase(),
        ) || [];
      const admins =
        spaceData?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (!admins.includes(userDID) && !superAdmins.includes(userDID)) {
        router.push('/');
      }
    }
  }, [ceramic?.did?.parent, router, spaceData]);

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
