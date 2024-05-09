import * as React from 'react';
import {
  Stack,
  Box,
  Typography,
  Input,
  TextField,
  Select,
  Button,
  SwipeableDrawer,
} from '@mui/material';
import { SessionHeader, SessionAdd, SessionList } from './components';
import { ZuButton, ZuSwitch } from 'components/core';
import {
  XMarkIcon,
  RightArrowCircleIcon,
  PlusCircleIcon,
} from 'components/icons';
import { TextEditor } from 'components/editor/editor';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Sessions = () => {
  const [isChecked, setIsChecked] = React.useState(true);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="50px"
        borderBottom="1px solid #383838"
        paddingX={3}
      >
        <ZuButton
          startIcon={<XMarkIcon />}
          onClick={() => toggleDrawer('right', false)}
        >
          Close
        </ZuButton>
        <ZuButton>Open Session</ZuButton>
      </Box>
      <Box display="flex" flexDirection="column" gap="20px" padding={3}>
        <Typography fontSize="18px" fontWeight="bold">
          Session Details
        </Typography>
        <Stack direction={'column'} spacing={1}>
          <Typography
            variant='bodyBB'
          >
            Session Name
          </Typography>
          <Input
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="Enter a name for your event"
          />
          <Typography
            variant='bodyBB'
          >
            Location
          </Typography>
          <Input
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="Enter a name for your event"
          />
          <Typography
            variant='bodyBB'
          >
            Session Date & Time
          </Typography>
          <Input
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="00-00-0000"
          />
        </Stack>
        <Stack direction={'column'} spacing={1}>
          <Typography
            variant='bodyBB'
          >
            Description
          </Typography>
          <TextEditor
            holder="space_description"
            sx={{
              backgroundColor: '#ffffff0d',
              fontFamily: 'Inter',
              color: 'white',
              padding: '12px 12px 12px 80px',
              borderRadius: '10px',
            }}
          />
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <svg
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_4575_7884)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.80085 4.06177H2.83984V11.506H4.88327V7.3727L6.82879 10.0394L8.68199 7.3727V11.506H10.6226V4.06177H8.68199L6.82879 6.81714L4.80085 4.06177ZM1.55636 0.794922H18.4436C19.3028 0.794922 20 1.59076 20 2.57247V13.0174C20 13.9989 19.3032 14.7949 18.4436 14.7949H1.55636C0.697166 14.7949 0 13.9991 0 13.0174V2.57247C0 1.59091 0.696805 0.794922 1.55636 0.794922ZM14.0078 4.10603H13.9884V7.92826H12.1206L15 11.506L17.8795 7.90628H15.9347V4.10603H14.0078Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_4575_7884">
                  <rect
                    width="20"
                    height="14"
                    fill="white"
                    transform="translate(0 0.794922)"
                  />
                </clipPath>
              </defs>
            </svg>
            <Typography>Markdown Available</Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'} spacing={1}>
          <Typography
            variant='bodyBB'
          >
            Select a Track
          </Typography>
          <Input
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="On Sale"
          />
        </Stack>
        <ZuButton
          sx={{
            width: '100%',
          }}
          startIcon={<PlusCircleIcon />}
        >
          Add Session
        </ZuButton>
      </Box>
    </Box>
  );

  return (
    <Stack direction={'column'} spacing={6} paddingBottom={5}>
      <SessionHeader onToggle={toggleDrawer} />
      <SessionList />
      <SessionAdd />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '50px',
            height: 'calc(100% - 50px)',
            boxShadow: 'none',
          },
        }}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {list('right')}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Sessions;
