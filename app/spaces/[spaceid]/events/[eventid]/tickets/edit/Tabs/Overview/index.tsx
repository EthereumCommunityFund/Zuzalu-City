import * as React from 'react';
import { Stack } from '@mui/material';
import { OverviewHeader, OverviewDetail, OverviewInvite, OverviewPosts } from './components';

const Overview = () => {
  return (
    <Stack direction='column' spacing={4} paddingBottom={5}>
      <OverviewHeader />
      <OverviewDetail />
      <OverviewInvite />
      <OverviewPosts />
    </Stack>
  )
}

export default Overview;