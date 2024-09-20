import * as React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';

const Header = () => {
  const { breakpoints } = useTheme();
  return (
    <Stack
      direction={'column'}
      spacing={3}
      pb="30px"
      borderBottom="1px solid #313131"
    >
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        sx={{
          [breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
          },
        }}
      >
        <Typography variant="h5">Announcements</Typography>
        <Stack direction="row">
          <Typography variant="body1" color="white">
            Today&apos;s Date:&nbsp;
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Header;
