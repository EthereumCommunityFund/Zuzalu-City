'use client';
import * as React from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import { IconSidebar, Header, Thumb, Sidebar } from './components';
import {
  EventName,
  EventAbout,
  EventDetail,
  EventRegister,
} from 'components/event';

const Home = () => {
  const [tabName, setTabName] = React.useState<string>('About');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <Stack direction="row">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && <Sidebar />}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header />
        <Thumb tabName={tabName} setTabName={setTabName} />
        <Stack padding="40px" justifyContent="center" alignItems="center">
          <Stack width={900}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <EventName />
              </Grid>
              <Grid item xs={12} md={4}>
                <EventRegister />
              </Grid>
              <Grid item xs={12} md={8}>
                <EventAbout />
              </Grid>
              <Grid item xs={12} md={4}>
                <EventDetail />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
