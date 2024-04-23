'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  TextField,
  Select,
  SwipeableDrawer,
} from '@mui/material';
import {
  ShareIcon,
  ThreeHorizonIcon,
  PlusIcon,
  InformationIcon,
  XMarkIcon,
  RightArrowCircleIcon,
} from 'components/icons';
import { EventMCard } from 'components';
import ZuButton from 'components/core/Button';
import ZuTypography from 'components/core/Typograpy';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Event = () => {
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
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="10"
      paddingTop="50px"
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
      <Box display="flex" flexDirection="column" gap="30px" padding="10px">
        <Typography
          color="white"
          fontSize="24px"
          fontWeight={700}
          fontFamily="Inter"
        >
          Create your Event
        </Typography>
        <Box bgcolor="#2d2d2d" borderRadius="10px">
          <Box
            padding="20px"
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #383838"
          >
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Profile
            </Typography>
            <Select
              sx={{
                width: '30%',
                height: '30px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                backgroundColor: '#373737',
                borderRadius: '10px',
              }}
            ></Select>
          </Box>
          <Box padding="20px" display="flex" flexDirection="column" gap="20px">
            <Box>
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Event Name
              </Typography>
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: '#373737',
                  padding: '5px 10px',
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
                placeholder="Type an awesome name"
              />
            </Box>
            <Box>
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Event Tagline
              </Typography>
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: '#373737',
                  padding: '5px 10px',
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
                placeholder="Write a short, one-sentence tagline for your event"
              />
            </Box>
            <Box display="flex" justifyContent="space-between" gap="30px">
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Category
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Tags
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
            </Box>
            <Box>
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Social Hashtag
              </Typography>
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: '#373737',
                  padding: '5px 10px',
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
                placeholder="Enter Link Title"
              />
            </Box>
            <Box>
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Event Description
              </Typography>
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: '#373737',
                  padding: '5px 10px',
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
                placeholder="Write a short, one-sentence tagline for your event"
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              gap="20px"
              borderTop="1px solid #383838"
              borderBottom="1px solid #383838"
              paddingY="30px"
            >
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Start Date
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  End Date
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="20px">
              <Typography
                color="white"
                fontSize="18px"
                fontWeight={700}
                fontFamily="Inter"
              >
                Location
              </Typography>
              <Box display="flex" justifyContent="space-between" gap="20px">
                <Box
                  bgcolor="#373737"
                  borderRadius="10px"
                  padding="10px"
                  flex={1}
                >
                  <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={600}
                    fontFamily="Inter"
                  >
                    In-Person
                  </Typography>
                  <Typography color="white" fontSize="10px" fontFamily="Inter">
                    This is a physical event
                  </Typography>
                </Box>
                <Box
                  bgcolor="#373737"
                  borderRadius="10px"
                  padding="10px"
                  flex={1}
                >
                  <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={600}
                    fontFamily="Inter"
                  >
                    Online
                  </Typography>
                  <Typography color="white" fontSize="10px" fontFamily="Inter">
                    Specially Online Event
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Event Location
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
              <Button
                sx={{
                  backgroundColor: '#353535',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Inter',
                  textTransform: 'none',
                }}
              >
                Add Address
              </Button>
            </Box>
          </Box>
        </Box>
        <Box bgcolor="#2d2d2d" borderRadius="10px">
          <Box
            padding="20px"
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #383838"
          >
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Event Avatar & Banner
            </Typography>
          </Box>
          <Box padding="20px" display="flex" flexDirection="column" gap="10px">
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Event Image
            </Typography>
            <Typography
              color="white"
              fontSize="13px"
              fontWeight={500}
              fontFamily="Inter"
            >
              200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
            </Typography>
            <Button
              sx={{
                width: 'min-content',
                color: 'white',
                borderRadius: '30px',
                backgroundColor: '#373737',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid #383838',
              }}
            >
              Upload
            </Button>
            <Box
              width="200px"
              height="200px"
              bgcolor="#373737"
              borderRadius="20px"
            />
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Event Banner
            </Typography>
            <Typography
              color="white"
              fontSize="13px"
              fontWeight={500}
              fontFamily="Inter"
            >
              200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
            </Typography>
            <Button
              sx={{
                width: 'min-content',
                color: 'white',
                borderRadius: '30px',
                backgroundColor: '#373737',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid #383838',
              }}
            >
              Upload
            </Button>
            <Box
              width="100%"
              height="200px"
              bgcolor="#373737"
              borderRadius="20px"
            />
          </Box>
        </Box>
        <Box bgcolor="#2d2d2d" borderRadius="10px">
          <Box
            padding="20px"
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #383838"
          >
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              External Links
            </Typography>
          </Box>
          <Box padding="20px" display="flex" flexDirection="column" gap="20px">
            <Box display="flex" justifyContent="space-between" gap="20px">
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Link
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
              <Box flex={1}>
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  URL
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#373737',
                    padding: '5px 10px',
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
                  placeholder="Enter Link Title"
                />
              </Box>
            </Box>
            <Button
              sx={{
                color: 'white',
                borderRadius: '30px',
                backgroundColor: '#373737',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid #383838',
              }}
            >
              Add Link
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  return (
    <Box width="100%" borderLeft="1px solid #383838">
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px 14px"
        borderBottom="1px solid #383838"
        bgcolor="#2d2d2d"
      >
        <Typography
          fontSize="18px"
          fontWeight={700}
          fontFamily="Inter"
          color="white"
          sx={{ lineHeight: '44px' }}
        >
          Manage Event
        </Typography>
        <Box display="flex" gap="10px">
          <Box
            padding="10px"
            display="flex"
            alignItems="center"
            bgcolor="#333333"
            borderRadius="10px"
          >
            <ShareIcon />
          </Box>
          <Box
            padding="10px"
            display="flex"
            alignItems="center"
            bgcolor="#333333"
            borderRadius="10px"
          >
            <ThreeHorizonIcon />
          </Box>
        </Box>
      </Box>
      <Box padding="20px" display="flex" flexDirection="column" gap="30px">
        <Box display="flex" gap="20px">
          <Typography
            color="white"
            fontSize="24px"
            fontWeight={700}
            fontFamily="Inter"
          >
            Events
          </Typography>
          <Button
            sx={{
              color: 'white',
              borderRadius: '10px',
              backgroundColor: '#2d2d2d',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
            }}
            startIcon={<PlusIcon size={5} />}
            onClick={toggleDrawer('right', true)}
          >
            Add New Event
          </Button>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px">
          <Typography
            fontFamily="Inter"
            fontSize="14px"
            fontStyle="italic"
            color="white"
            sx={{ opacity: 0.5 }}
          >
            Prototype Note: First card is click-able
          </Typography>
          <EventMCard type={0} applicants={14} isSideEventActive={true} />
          <EventMCard type={0} applicants={14} />
          <EventMCard type={2} applicants={0} />
          <EventMCard type={1} applicants={3} />
        </Box>
        <Typography
          color="white"
          fontSize="24px"
          fontWeight={700}
          fontFamily="Inter"
        >
          Past Events
        </Typography>
        <Box display="flex" flexDirection="column" gap="10px">
          <EventMCard type={3} applicants={14} />
          <EventMCard type={3} applicants={3} />
        </Box>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box display="flex" flexDirection="column" gap="5px">
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" gap="5px" alignItems="center">
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Invite Event Admins
                </Typography>
                <InformationIcon color="#919191" size={5} />
              </Box>
              <ZuButton startIcon={<PlusIcon size={4} />}>Invite</ZuButton>
            </Box>
            <Typography
              color="white"
              fontSize="14px"
              fontFamily="Inter"
              sx={{
                opacity: 0.7,
              }}
            >
              Invite users to manage access of attendees and scan tickets
            </Typography>
          </Box>
          <Box
            bgcolor="#262626"
            borderRadius="10px"
            padding="10px"
            sx={{ opacity: 0.8 }}
          >
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
            >
              No Invites
            </Typography>
            <Typography color="white" fontSize="10px" fontFamily="Inter">
              You can invite members or other individuals via email
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

export default Event;
