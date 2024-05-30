'use client';
import * as React from 'react';
import {
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  SearchIcon,
  HomeIcon,
  MegaPhoneIcon,
  EventIcon,
  ArrowDownIcon,
} from 'components/icons';

const SubSidebar = () => {
  return (
    <Stack
      padding={2}
      direction="column"
      spacing={1}
      width={'280px'}
      bgcolor="#222222"
      height="auto"
    >
      <Stack>
        <Stack
          bgcolor="#404440"
          borderRadius="10px"
          border="1px solid #383838"
          padding="10px"
          direction="row"
          spacing="10px"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
        >
          <Box
            component="img"
            width={40}
            height={40}
            borderRadius={20}
            src="/1.webp"
          />
          <Typography
            variant="subtitleS"
            color="white"
            sx={{ textWrap: 'wrap' }}
          >
            Zuzalu City Contributors
          </Typography>
          <ArrowDownIcon />
        </Stack>
      </Stack>
      <Stack
        direction="column"
        spacing={0.5}
        paddingY={2}
        borderBottom="1px solid #383838"
        borderTop="1px solid #383838"
      >
        <OutlinedInput
          placeholder="Search"
          sx={{
            backgroundColor: '#222222',
            paddingX: '10px',
            paddingY: '13px',
            borderRadius: '10px',
            height: '35px',
            // border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
            fontFamily: 'Inter',
            opacity: 0.7,
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor:
                'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            },
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          spacing={1}
          borderRadius="10px"
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}
        >
          <HomeIcon />
          <Typography color="white" variant="bodyBB">
            Home
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          spacing={1}
          borderRadius="10px"
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}
        >
          <MegaPhoneIcon />
          <Typography color="white" variant="bodyBB">
            Announcements
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          spacing={1}
          borderRadius="10px"
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#383838' } }}
        >
          <EventIcon />
          <Typography color="white" variant="bodyBB">
            Events
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SubSidebar;
