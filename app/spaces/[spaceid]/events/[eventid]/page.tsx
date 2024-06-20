'use client';
import React, { useEffect, useState } from 'react';
import { Stack, useTheme, useMediaQuery } from '@mui/material';
import { About, Sessions } from './tabs';
import { IconSidebar, Header, Thumb, Sidebar } from './components';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';

const Home = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));
  const params = useParams();

  const [tabName, setTabName] = useState<string>('About');
  const [eventData, setEventData] = useState<Event>();

  return (
    <Stack direction="row" width="100%">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && (
        <Stack
          sx={{
            minWidth: '280px',
            width: '280px',
            backgroundColor: '#222',
            display: 'none',
            [theme.breakpoints.up('lg')]: {
              display: 'block',
            },
          }}
        >
          <Sidebar
            spaceId={params.spaceid.toString()}
            title={eventData?.space?.name}
            avatar={eventData?.space?.avatar}
            banner={eventData?.space?.banner}
          />
        </Stack>
      )}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header name={eventData?.title} spaceId={params.spaceid.toString()} />
        <Thumb tabName={tabName} setTabName={setTabName} />
        {tabName === 'About' && (
          <About eventData={eventData} setEventData={setEventData} />
        )}
        {tabName === 'Sessions' && <Sessions />}
      </Stack>
    </Stack>
  );
};

export default Home;
