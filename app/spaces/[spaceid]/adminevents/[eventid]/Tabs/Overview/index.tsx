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
  event?: Event;
}

const Overview = ({ event }: PropTypes) => {
  return (
    <Stack direction="column" spacing={4} padding={'30px'}>
      <OverviewHeader event={event} />
      <OverviewDetail eventData={event} />
      <OverviewInvite event={event} />
      {/* <OverviewPosts /> */}
    </Stack>
  );
};

export default Overview;
