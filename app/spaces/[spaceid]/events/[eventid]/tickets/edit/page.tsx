'use client';
import * as React from 'react';
import {
  Box,
  Stack
} from '@mui/material';

import { Ticket, Overview } from './Tabs';
import { Tabbar } from 'components/layout';


const Home: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('');

  return (
    <Stack width="100%">
      <Tabbar />
      <Stack direction='row' justifyContent='center'>
        <Box width="60%" marginTop={3}>
          <Overview />
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
