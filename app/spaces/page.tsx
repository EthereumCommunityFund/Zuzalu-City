'use client';
import * as React from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from 'components/layout';
import { SpaceHeader } from './components';
import { SpaceCard } from 'components';
import { MOCK_DATA } from 'mock';

const Home = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Stack direction="row">
      {!isTablet && <Sidebar />}
      <Stack direction="column" borderLeft="1px solid #383838" flex={1}>
        <SpaceHeader />
        <Grid container spacing={{ xs: 2, md: 3 }} padding="20px">
          {MOCK_DATA.spaces.map((item, index) => (
            <Grid
              item
              key={`SpaceHeader-Card${index}`}
              xs={12}
              sm={6}
              md={4}
              xl={3}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <SpaceCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default Home;
