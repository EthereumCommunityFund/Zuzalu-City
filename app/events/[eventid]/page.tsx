'use client';
import React from 'react';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { Overview, Sessions } from './tabs';

const Home = () => {
  const renderPage = () => {
    switch (tabName) {
      case 'About':
        return <Overview />;
      case 'Sessions':
        return <Sessions />;
      default:
        return <Overview />;
    }
  };
  const [tabName, setTabName] = React.useState('Overview');
  return (
    <Stack>
      <Thumbnail />
      <Subbar tabName={tabName} setTabName={setTabName} />
      {renderPage()}
    </Stack>
  );
};

export default Home;
