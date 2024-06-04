'use client';
import * as React from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';

import { Ticket, Overview, Sessions, Venue } from './Tabs';
import { Tabbar } from 'components/layout';

const Home: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');

  const isMobile = useMediaQuery('(max-width:500px)');
  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview />;
      case 'Tickets':
        return <Ticket />;
      case 'Event Sessions':
        return <Sessions />;
      case 'Venue':
        return <Venue />;
      default:
        return <Overview />;
    }
  };

  return (
    <Stack width="100%">
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
