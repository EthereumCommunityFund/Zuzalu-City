import { ZuCalendar, ZuSelect } from '@/components/core';
import { SearchIcon } from '@/components/icons';
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import dayjs from 'dayjs';

interface SidebarLeftProps {
  onSearch: () => void;
  onTextChange: (text: string) => void;
}

export default function SidebarLeft(props: SidebarLeftProps) {
  const { onSearch, onTextChange } = props;
  const { breakpoints } = useTheme();

  return (
    <Stack
      sx={{
        display: 'flex',
        padding: '20px 10px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
        [breakpoints.down('lg')]: {
          width: '260px',
        },
        [breakpoints.down('md')]: {
          display: 'none',
        },
        width: '385px',
        alignSelf: 'stretch',
        borderLeft: '1px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      <Stack
        sx={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <OutlinedInput
          placeholder="Search Events"
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              onSearch();
            }
          }}
          sx={{
            backgroundColor: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            paddingX: '15px',
            paddingY: '13px',
            borderRadius: '10px',
            height: '35px',
            border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
            fontFamily: 'Inter',
            opacity: 0.7,
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          onChange={(e) => onTextChange(e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ opacity: 0.6 }}>
              <SearchIcon />
            </InputAdornment>
          }
        />
        {/*<Stack*/}
        {/*  sx={{*/}
        {/*    padding: '20px 10px',*/}
        {/*    borderBottom: '1px solid rgba(255, 255, 255, 0.10)',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography*/}
        {/*    fontSize={'18px'}*/}
        {/*    fontWeight={'700'}*/}
        {/*    lineHeight={'120%'}*/}
        {/*    color={'white'}*/}
        {/*  >*/}
        {/*    Sort & Filter Events*/}
        {/*  </Typography>*/}
        {/*</Stack>*/}
        {/*<Box*/}
        {/*  display="flex"*/}
        {/*  gap="4px"*/}
        {/*  padding="2px"*/}
        {/*  borderRadius="10px"*/}
        {/*  bgcolor="#2d2d2d"*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    sx={{*/}
        {/*      flex: 1,*/}
        {/*      backgroundColor: '#424242',*/}
        {/*      borderRadius: '8px',*/}
        {/*      color: 'white',*/}
        {/*      fontFamily: 'Inter',*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Upcoming*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    sx={{*/}
        {/*      flex: 1,*/}
        {/*      backgroundColor: '#2d2d2d',*/}
        {/*      borderRadius: '8px',*/}
        {/*      color: 'white',*/}
        {/*      fontFamily: 'Inter',*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Past*/}
        {/*  </Button>*/}
        {/*</Box>*/}
        {/*<Box>*/}
        {/*  <ZuCalendar defaultValue={dayjs('2022-04-17')} />*/}
        {/*</Box>*/}
      </Stack>
    </Stack>
  );
}
