'use client';
import React from 'react';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { About, Sessions } from './tabs';

const Home = () => {
  const renderPage = () => {
    switch (tabName) {
      case 'About':
        return <About />;
      case 'Sessions':
        return <Sessions />;
      default:
        return <About />;
    }
  };
  const [tabName, setTabName] = React.useState('About');
  return (
    <Stack>
      <Thumbnail />
      <Subbar tabName={tabName} setTabName={setTabName} />
      {renderPage()}
    </Stack>
  );
};

export default Home;
