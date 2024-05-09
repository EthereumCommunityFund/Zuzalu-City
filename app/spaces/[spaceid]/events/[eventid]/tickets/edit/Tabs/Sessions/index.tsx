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
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
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
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
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
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
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
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
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
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
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
        </Box>
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
