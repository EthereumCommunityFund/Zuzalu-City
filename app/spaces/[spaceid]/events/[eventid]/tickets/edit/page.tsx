'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Input,
  TextField,
  Select,
  SwitchProps,
  SwipeableDrawer,
} from '@mui/material';
import { styled } from '@mui/material';

import {
  ThreeVerticalIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  RightArrowCircleIcon,
  EyeSlashIcon,
} from '../../../../../../../components/icons';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#58A68B',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Ticket: React.FC = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: React.MouseEvent) => {
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '500px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="100"
      padding="30px"
    >
      <Box display="flex" justifyContent="space-between">
        <Button
          sx={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter',
            borderRadius: '10px',
            opacity: 0.7,
            '&:hover': {
              backgroundColor: '#2d2d2d',
            },
          }}
          startIcon={<XMarkIcon />}
          onClick={toggleDrawer('right', false)}
        >
          Close
        </Button>
        <Button
          sx={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Inter',
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
          }}
        >
          Open Session
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap="20px">
        <Typography
          color="white"
          fontSize="18px"
          fontWeight={500}
          fontFamily="Inter"
        >
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
              padding: '12px 5px',
              borderRadius: '8px',
              height: '200px',
              width: '100%',
              '& .MuiInputBase-input-MuiOutlinedInput-input': {
                fontFamily: 'Inter',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-inputMultiline': {
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
            <IOSSwitch
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
            <IOSSwitch
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
            <IOSSwitch
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
            <IOSSwitch
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
    <Box width="1000px">
      <Box display="flex" flexDirection="column" gap="40px" flexGrow={1}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            color="white"
            fontSize="24px"
            fontWeight={700}
            fontFamily="Inter"
          >
            Ticketing
          </Typography>
          <Typography color="white" fontSize="14px" fontFamily="Inter">
            Total Sold: 18
          </Typography>
        </Box>
        <Box
          display="flex"
          gap="10px"
          paddingBottom="20px"
          borderBottom="1px solid rgba(255, 255, 255, .1)"
        >
          <Box
            display="flex"
            alignItems="center"
            gap="10px"
            borderRadius="10px"
            padding="10px"
            width="50%"
            sx={{
              background: isChecked
                ? 'linear-gradient(117deg, #354d44 0%, #2d2d2d 100%)'
                : '#2d2d2d',
            }}
          >
            <IOSSwitch
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <Box>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={600}
                fontFamily="Inter"
              >
                Applications
              </Typography>
              <Typography
                color="white"
                fontSize="13px"
                fontWeight={400}
                fontFamily="Inter"
              >
                Open
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Event Tickets
              </Typography>
            </Box>
            <Button
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#2d2d2d',
                fontFamily: 'Inter',
                fontSize: '14px',
              }}
              startIcon={<PlusIcon />}
              onClick={toggleDrawer('right', true)}
            >
              New Ticket
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="10px"
            borderRadius="20px"
            sx={{ backgroundColor: '#2d2d2d' }}
            padding="10px"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography
                  color="white"
                  fontSize="24px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Resident
                </Typography>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={500}
                  fontFamily="Inter"
                >
                  &nbsp;&nbsp;&nbsp;$690.00
                </Typography>
              </Box>
              <Button
                startIcon={<ThreeVerticalIcon />}
                sx={{
                  padding: 0,
                  minWidth: 0,
                  borderRadius: '10px',
                  backgroundColor: '#404040',
                  height: '30px',
                  width: '30px',
                  '& .MuiButton-startIcon': {
                    margin: 0,
                  },
                }}
              />
            </Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={400}
              fontFamily="Inter"
            >
              Open to All
            </Typography>
            <Box display="flex" gap="10px" alignItems="center">
              <Box
                display="flex"
                padding="4px 10px"
                gap="4px"
                alignItems="center"
                sx={{ backgroundColor: '#7dffd133', borderRadius: '10px' }}
              >
                <CheckCircleIcon color="rgb(125, 255, 209)" />
                <Typography
                  color="rgb(125, 255, 209)"
                  fontFamily="Inter"
                  fontSize="13px"
                >
                  Available
                </Typography>
              </Box>
              <Typography color="white" fontFamily="Inter" fontSize="14px">
                Sold: 14
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="10px"
            borderRadius="20px"
            sx={{ backgroundColor: '#2d2d2d' }}
            padding="10px"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography
                  color="white"
                  fontSize="24px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  VIP
                </Typography>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={500}
                  fontFamily="Inter"
                >
                  &nbsp;&nbsp;&nbsp;4.20 ETH
                </Typography>
              </Box>
              <Button
                startIcon={<ThreeVerticalIcon />}
                sx={{
                  padding: 0,
                  minWidth: 0,
                  borderRadius: '10px',
                  backgroundColor: '#404040',
                  height: '30px',
                  width: '30px',
                  '& .MuiButton-startIcon': {
                    margin: 0,
                  },
                }}
              />
            </Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={400}
              fontFamily="Inter"
            >
              Open to All
            </Typography>
            <Box display="flex" gap="10px" alignItems="center">
              <Box
                display="flex"
                padding="4px 10px"
                gap="4px"
                alignItems="center"
                sx={{ backgroundColor: '#3B352D', borderRadius: '10px' }}
              >
                <EyeSlashIcon color="#9A7B51" />
                <Typography color="#9A7B51" fontFamily="Inter" fontSize="13px">
                  Hidden
                </Typography>
              </Box>
              <Typography color="white" fontFamily="Inter" fontSize="14px">
                Sold: 14
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="10px"
            borderRadius="20px"
            sx={{ backgroundColor: '#2d2d2d' }}
            padding="10px"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography
                  color="white"
                  fontSize="24px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Sponsored Pass
                </Typography>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={500}
                  fontFamily="Inter"
                >
                  &nbsp;&nbsp;&nbsp;FREE
                </Typography>
              </Box>
              <Button
                startIcon={<ThreeVerticalIcon />}
                sx={{
                  padding: 0,
                  minWidth: 0,
                  borderRadius: '10px',
                  backgroundColor: '#404040',
                  height: '30px',
                  width: '30px',
                  '& .MuiButton-startIcon': {
                    margin: 0,
                  },
                }}
              />
            </Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={400}
              fontFamily="Inter"
            >
              Open to All
            </Typography>
            <Box display="flex" gap="10px" alignItems="center">
              <Box
                display="flex"
                padding="4px 10px"
                gap="4px"
                alignItems="center"
                sx={{ backgroundColor: '#7dffd133', borderRadius: '10px' }}
              >
                <CheckCircleIcon color="rgb(125, 255, 209)" />
                <Typography
                  color="rgb(125, 255, 209)"
                  fontFamily="Inter"
                  fontSize="13px"
                >
                  Available
                </Typography>
              </Box>
              <Typography color="white" fontFamily="Inter" fontSize="14px">
                Sold: 14
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography fontFamily="Inter">
          Prototype Note: Below shows an empty state
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          paddingBottom="20px"
        >
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Access Management Staff
                </Typography>
              </Box>
              <Button
                sx={{
                  color: 'white',
                  borderRadius: '10px',
                  backgroundColor: '#2d2d2d',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                + Invite
              </Button>
            </Box>
            <Typography color="white" fontFamily="Inter" fontSize="14px">
              Invite users to only manage access of attendees and scan tickets
            </Typography>
          </Box>
          <Box
            borderRadius="10px"
            bgcolor="#2d2d2d"
            display="flex"
            flexDirection="column"
            justifyItems="center"
            padding="10px"
          >
            <Typography
              color="white"
              fontFamily="Inter"
              fontSize="16px"
              fontWeight={700}
            >
              No Invites
            </Typography>
            <Typography color="white" fontFamily="Inter" fontSize="10px">
              You can invite members or other individuals via email
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          paddingBottom="20px"
        >
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Application Questions
                </Typography>
              </Box>
              <Button
                sx={{
                  color: 'white',
                  borderRadius: '10px',
                  backgroundColor: '#2d2d2d',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                + Add a Question
              </Button>
            </Box>
            <Typography color="white" fontFamily="Inter" fontSize="14px">
              Add a series of questions for users to answer when they apply for
              your event
            </Typography>
          </Box>
          <Box
            borderRadius="10px"
            bgcolor="#2d2d2d"
            display="flex"
            flexDirection="column"
            justifyItems="center"
            padding="10px"
          >
            <Typography
              color="white"
              fontFamily="Inter"
              fontSize="16px"
              fontWeight={700}
            >
              No questions created
            </Typography>
            <Typography color="white" fontFamily="Inter" fontSize="10px">
              create a question
            </Typography>
          </Box>
        </Box>
      </Box>
      <SwipeableDrawer
        anchor="right"
        open={state['right']}
        onClose={toggleDrawer('right', false)}
        onOpen={toggleDrawer('right', true)}
      >
        {list('right')}
      </SwipeableDrawer>
    </Box>
  );
};

export default Ticket;
