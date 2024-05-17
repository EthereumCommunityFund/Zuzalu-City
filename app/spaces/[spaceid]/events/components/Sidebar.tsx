import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack,
  Select,
  Button,
  Typography,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import {
  SearchIcon,
  HomeIcon,
  PlusIcon,
  StreamIcon,
  MegaPhoneIcon,
  ChatIcon,
  EventIcon,
  TableIcon,
  QuestionIcon,
} from 'components/icons';
import { ZuButton } from 'components/core';

const Sidebar = () => {
  const router = useRouter();

  return (
    <Stack
      padding={2}
      direction="column"
      spacing={1}
      width={300}
      bgcolor="#222222"
      height="100vh"
    >
      <Stack>
        <ZuButton>Exit Space</ZuButton>
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        paddingY={2}
        borderBottom="1px solid #383838"
        borderTop="1px solid #383838"
      >
        <OutlinedInput
          placeholder="Search"
          sx={{
            backgroundColor: '#222222',
            paddingX: '15px',
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
        <ZuButton startIcon={<HomeIcon />} sx={{ paddingLeft: 2 }}>
          Home
        </ZuButton>
        <ZuButton startIcon={<StreamIcon />} sx={{ paddingLeft: 2 }}>
          Space Stream
        </ZuButton>
        <ZuButton startIcon={<MegaPhoneIcon />} sx={{ paddingLeft: 2 }}>
          Announcements
        </ZuButton>
        <ZuButton startIcon={<ChatIcon />} sx={{ paddingLeft: 2 }}>
          Chats
        </ZuButton>
        <ZuButton
          startIcon={<EventIcon />}
          endIcon={<PlusIcon />}
          sx={{ paddingLeft: 2 }}
        >
          Events
        </ZuButton>
        <ZuButton startIcon={<QuestionIcon />} sx={{ paddingLeft: 2 }}>
          FAQ
        </ZuButton>
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography color="white" variant="bodyS">
          ADMINS
        </Typography>
        <ZuButton
          startIcon={<TableIcon />}
          sx={{ paddingLeft: 2 }}
          onClick={() => router.push('/spaces/123/events/456/edit')}
        >
          Manage Events
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
