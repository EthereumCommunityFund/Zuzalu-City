'use client';
import * as React from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import {
  IconSidebar,
  Header,
  Thumb,
  EventName,
  EventAbout,
  EventRegister,
  EventDetail,
  Sidebar,
} from './components';

const Home = () => {
  const [tabName, setTabName] = React.useState<string>('About');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down('xl'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction="row">
      {!isDesktop && <IconSidebar />}
      {!isDesktop && <Sidebar />}
      <Stack flex={1} borderLeft="1px solid #383838">
        <Header />
        <Thumb tabName={tabName} setTabName={setTabName} />
        <Stack padding="40px" justifyContent="center" alignItems="center">
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
  );
};

export default Home;
