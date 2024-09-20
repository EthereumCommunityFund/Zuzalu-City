'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, useTheme } from '@mui/material';
import { Header, PostList } from './components';
import { Event, Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Drawer from '@/components/drawer';
import PostForm from '@/components/form/PostForm';
import { getPosts } from '@/services/announcements';

interface IVenue {
  event: Event | undefined;
}

const Home: React.FC<IVenue> = ({ event }) => {
  const { breakpoints } = useTheme();
  const params = useParams();
  const eventId = params.eventid.toString();

  const [open, setOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ['getPosts', eventId],
    queryFn: () => getPosts(eventId),
  });

  return (
    <Stack
      spacing="30px"
      padding="0 30px 30px"
      sx={{
        [breakpoints.down('sm')]: {
          padding: '0 20px 20px',
        },
      }}
    >
      <Header />
      <PostList
        posts={data?.data as Post[]}
        refetch={refetch}
        onToggle={toggleDrawer}
      />
      <Drawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <PostForm handleClose={toggleDrawer} refetch={refetch} />
      </Drawer>
    </Stack>
  );
};

export default Home;
