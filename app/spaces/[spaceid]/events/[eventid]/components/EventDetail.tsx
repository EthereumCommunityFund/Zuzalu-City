import * as React from 'react';
import { Stack, Typography, Box, useTheme } from '@mui/material';
import { RightArrowIcon } from 'components/icons';

const EventDetail = () => {
  const { breakpoints } = useTheme();

  return (
    <Stack
      spacing="20px"
      sx={{
        padding: '0px',
        [breakpoints.down('md')]: {
          padding: '0px 10px 20px 10px',
        },
      }}
    >
      <Typography
        color="white"
        variant="subtitleMB"
        borderBottom="1px solid #383838"
        padding="14px"
      >
        Event Details
      </Typography>
      <Stack spacing="5px">
        <Typography color="white" variant="bodyB">
          Format: In-Person
        </Typography>
        <Typography color="white" variant="bodyB">
          Type: Meet-up
        </Typography>
      </Stack>
      <Stack
        spacing="10px"
        paddingBottom={'20px'}
        borderBottom={'1px solid rgba(255, 255, 255, 0.10)'}
      >
        <Typography color="white" variant="bodyBB" paddingBottom="20px">
          Links
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          bgcolor="#2a2a2a"
          padding="10px 14px"
          borderRadius="10px"
        >
          <Typography color="white" variant="bodyB">
            Link Name
          </Typography>
          <RightArrowIcon />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          bgcolor="#2a2a2a"
          padding="10px 14px"
          borderRadius="10px"
        >
          <Typography color="white" variant="bodyB">
            Link Name
          </Typography>
          <RightArrowIcon />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          bgcolor="#2a2a2a"
          padding="10px 14px"
          borderRadius="10px"
        >
          <Typography color="white" variant="bodyB">
            Link Name
          </Typography>
          <RightArrowIcon />
        </Stack>
      </Stack>
      <Stack spacing="5px">
        <Typography color="white" variant="bodyBB" paddingBottom="20px">
          Location
        </Typography>
        <Typography color="white" variant="bodyMB">
          City, Country
        </Typography>
        <Typography color="white" variant="bodyS">
          Apply to see address
        </Typography>
        <Box
          component="img"
          borderRadius="10px"
          height={'182px'}
          src="/15.webp"
        />
      </Stack>
    </Stack>
  );
};

export default EventDetail;
