import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import OverviewButton from './OverviewButton';

const OverviewHeader = () => {
  return (
    <Stack direction='column' spacing={3} marginBottom={3}>
      <Stack direction="row" justifyContent="space-between" alignItems='center'>
        <Typography variant="h5" color="white">
          Your Event
        </Typography>
        <Stack direction='row'>
          <Typography variant='body1' color='white'>
            Today&apos;s Date:&nbsp;
          </Typography>
          <Typography variant='body1' color='white' sx={{opacity: 0.7}}>
            Wednesday, April 24, 2024
          </Typography>
        </Stack>
      </Stack>
      <Stack direction='row' spacing={3}>
        <OverviewButton type={0} />
        <OverviewButton type={1} />
      </Stack>
    </Stack>
  )
}

export default OverviewHeader;