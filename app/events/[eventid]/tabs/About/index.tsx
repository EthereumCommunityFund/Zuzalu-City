'use client';
import * as React from 'react';
import { Stack, Grid } from '@mui/material';
import {
  EventName,
  EventDetail,
  EventRegister,
  EventAbout,
} from 'components/event';

const About = () => {
  return (
    <Stack padding="40px" direction="row" justifyContent="center">
      <Stack width={'900px'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <EventName />
          </Grid>
          <Grid item xs={12} md={5}>
            <EventRegister />
          </Grid>
          <Grid item xs={12} md={7}>
            <EventAbout />
          </Grid>
          <Grid item xs={12} md={5}>
            <EventDetail />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default About;
