import * as React from 'react';
import { Stack, Box, SwipeableDrawer, Button, Typography, Input, Select, TextField } from '@mui/material';
import {
  TicketHeader,
  TicketList,
  TicketAdd,
  TicketAccess,
} from './components';
import { XMarkIcon, RightArrowCircleIcon } from 'components/icons';
import { ZuSwitch, ZuButton } from 'components/core';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Ticket = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => {
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
      borderLeft='1px solid #383838'
    >
      <Box display="flex" alignItems='center' justifyContent="space-between" height='50px' borderBottom='1px solid #383838' paddingX={3}>
        <ZuButton
          startIcon={<XMarkIcon />}
          onClick={() => toggleDrawer('right', false)}
        >
          Close
        </ZuButton>
        <ZuButton>
          Open Session
        </ZuButton>
      </Box>
      <Box display="flex" flexDirection="column" gap="20px" padding={3}>
        <Typography fontSize="18px" fontWeight="bold">
          Ticket Basics
        </Typography>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Ticket Name
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
            Ticket Price
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
            placeholder="00.00"
          />
          <Typography
            color="white"
            fontSize="10px"
            fontWeight={500}
            fontFamily="Inter"
          >
            Input am amount
          </Typography>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Ticket Quantity
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
            Description
          </Typography>
          <TextField
            multiline
            rows={6}
            sx={{
              backgroundColor: '#2d2d2d',
              borderRadius: '8px',
              height: '200px',
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-inputMultiline': {
                fontFamily: 'Inter',
                color: 'white',
              },
            }}
            placeholder="Provide a captivating description of your event"
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
            Status
          </Typography>
          <Select
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              backgroundColor: '#2d2d2d',
            }}
          ></Select>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Min per order
          </Typography>
          <Select
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              backgroundColor: '#2d2d2d',
            }}
          ></Select>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Max per order
          </Typography>
          <Select
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              backgroundColor: '#2d2d2d',
            }}
          ></Select>
        </Box>
        <Box display="flex" flexDirection="column" gap="10px" padding="10px">
          <Box display="flex">
            <ZuSwitch
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={500}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide until a set date and time
            </Typography>
          </Box>
          <Box display="flex">
            <ZuSwitch
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={500}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide after a set date and time
            </Typography>
          </Box>
          <Box display="flex">
            <ZuSwitch
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={500}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide when sold out
            </Typography>
          </Box>
          <Box display="flex">
            <ZuSwitch
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={500}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Show quantity remaining on event screen
            </Typography>
          </Box>
        </Box>

        <Button
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter',
          }}
          startIcon={<RightArrowCircleIcon color="#67DAFF" />}
        >
          Save Ticket
        </Button>
      </Box>
    </Box>
  );

  return (
    <Stack spacing={2}>
      <TicketHeader />
      <TicketList onToggle={toggleDrawer} />
      <TicketAdd />
      <TicketAccess />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '67px',
            height: 'calc(100% - 67px)',
            boxShadow: 'none'
          }
        }}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {list('right')}
      </SwipeableDrawer>
    </Stack>
  )
}

export default Ticket;