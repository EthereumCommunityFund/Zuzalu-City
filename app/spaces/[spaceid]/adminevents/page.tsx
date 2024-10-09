'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Stack } from '@mui/material';
import { EventHeader, CurrentEvents } from './components';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, Space } from '@/types';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';

import Drawer from '@/components/drawer';
import { getSpaceEventsQuery } from '@/services/space';
import { useQuery } from '@tanstack/react-query';
import { EventForm } from '@/components/form/EventForm';

export interface IEventArg {
  args: {
    eventId: string;
  };
}

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [open, setOpen] = useState(false);

  const { ceramic, composeClient } = useCeramicContext();

  const { data: spaceData, refetch } = useQuery({
    queryKey: ['getSpaceByID', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpaceEventsQuery(), {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  const eventsData = useMemo(() => {
    return spaceData?.events?.edges.map((edge) => edge.node) as Event[];
  }, [spaceData]);

  useEffect(() => {
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

  const toggleDrawer = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleFormClose = useCallback(() => {
    toggleDrawer();
    refetch();
  }, [refetch, toggleDrawer]);

  return (
    <Stack direction="row" width={'100%'}>
      <SubSidebar
        title={spaceData?.name}
        spaceId={params.spaceid.toString()}
        avatar={spaceData?.avatar}
        banner={spaceData?.banner}
        isAdmin={true}
      />
      <Box width="100%" borderLeft="1px solid #383838">
        <EventHeader />
        <CurrentEvents events={eventsData ?? []} onToggle={toggleDrawer} />
        {/*<Invite />*/}
        <Drawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
          <EventForm spaceId={spaceId} handleClose={handleFormClose} />
        </Drawer>
      </Box>
    </Stack>
  );
};

export default Home;
