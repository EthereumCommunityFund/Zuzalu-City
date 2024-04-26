'use client';
import * as React from 'react';
import { Box, Stack } from '@mui/material';

import { Ticket, Overview } from './Tabs';
import { Tabbar } from 'components/layout';

const Home: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');
  console.log('tab', tabName);

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview />;
      case 'Tickets':
        return <Ticket />;
      default:
        return <Overview />;
    }
  };

  return (
    <Stack width="100%">
      <Tabbar tabName={tabName} setTabName={setTabName} />
      <Stack direction="row" justifyContent="center">
        <Box width="60%" marginTop={3}>
          {renderPage()}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
