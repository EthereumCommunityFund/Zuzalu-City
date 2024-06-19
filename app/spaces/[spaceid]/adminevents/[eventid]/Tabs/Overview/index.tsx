import * as React from 'react';
import { Stack } from '@mui/material';
import {
  OverviewHeader,
  OverviewDetail,
  OverviewInvite,
  OverviewPosts,
} from './components';
import { Event } from '@/types';

interface PropTypes {
  event?: Event
}

const Overview = ({ event }: PropTypes) => {
  return (
    <Stack direction="column" spacing={4} paddingBottom={5}>
      <OverviewHeader event={event} />
      <OverviewDetail eventData={event} />
      <OverviewInvite />
      {/* <OverviewPosts /> */}
    </Stack>
  );
};

export default Overview;
