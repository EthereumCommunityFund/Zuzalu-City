'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack } from '@mui/material';
import { Header, PostList } from './components';
import { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getVenues } from '@/services/venues';
import Drawer from '@/components/drawer';
import PostForm from '@/components/form/PostForm';

interface IVenue {
  event: Event | undefined;
}

const Home: React.FC<IVenue> = ({ event }) => {
  const params = useParams();
  const eventId = params.eventid.toString();

  const [open, setOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ['venues', eventId],
    queryFn: () => getVenues(eventId),
  });

  const venuesData = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  return (
    <Stack spacing="30px" padding="30px">
      <Header />
      <PostList
        event={event}
        venues={venuesData}
        refetch={refetch}
        onToggle={toggleDrawer}
      />
      <Drawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <PostForm handleClose={toggleDrawer} />
      </Drawer>
    </Stack>
  );
};

export default Home;
