'use client';
import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { About, Sessions } from './tabs';
import { Event } from '@/types';

const Home = () => {
  const [tabName, setTabName] = useState('About');

  const [eventData, setEventData] = useState<Event>();

  return (
    <Stack color="white">
      <Thumbnail />
      <Subbar tabName={tabName} setTabName={setTabName} />
      {tabName === 'About' && (
        <About eventData={eventData} setEventData={setEventData} />
      )}
      {tabName === 'Sessions' && <Sessions />}
    </Stack>
  );
};

export default Home;
