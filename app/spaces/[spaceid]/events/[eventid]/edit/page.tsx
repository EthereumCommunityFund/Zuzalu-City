'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  TextField,
  Select,
  SwipeableDrawer,
} from '@mui/material';
import { XMarkIcon } from 'components/icons';
import { EventHeader, CurrentEvents, PastEvents, Invite } from './components';
import { ZuButton } from 'components/core';
import { useCeramicContext } from '@/context/CeramicContext';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Event = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
  } = useCeramicContext();
  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };
  const [eventName, setEventName] = useState('');

  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEventName(event.target.value);
  };
  const [eventTagline, setEventTagline] = useState('');

  const handleEventTaglineChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEventTagline(event.target.value);
  };
  const updateSpace = async () => {
    const update = await composeClient.executeQuery(`
      mutation  {
        createEvent(
          input: {
            content: {
              title: "${eventName}",
              description: "",
              startTime: ""2024-09-09T00:00:00Z"",
              endTime: ""2024-09-010T00:00:00Z"",
              spaceId: "",
              createdAt: ""2024-08-09T00:00:00Z"",
              profileId: "k2t6wzhkhabz4a09lsxkr3jbej43j9ubk0dt841uy8uq3m5c5y2iauknqo87t2",
              max_participant: 100,
              min_participant: 10,
              participant_count: 10,
              external_url: "",
              image_url: "",
              meeting_url: "",
              status: "",
              timezone: ""
            }
          }
        ) {
          document {
            createdAt
            description
            endTime
            external_url
            id
            image_url
            max_participant
            meeting_url
            min_participant
            participant_count
            profileId
            spaceId
            startTime
            status
            timezone
            title
          }
        }
      }
    `);
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="10"
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
            {/* <Select
              sx={{
                width: '30%',
                height: '30px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                backgroundColor: '#373737',
                borderRadius: '10px',
              }}
            ></Select> */}
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
                value={eventName}
                onChange={handleEventNameChange}
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
                value={eventTagline}
                onChange={handleEventTaglineChange}
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
              <ZuButton
                variant="contained"
                sx={{
                  backgroundColor: '#353535',
                  color: 'white',
                  borderRadius: '10px',
                  textTransform: 'none',
                }}
              >
                Add Address
              </ZuButton>
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
            <ZuButton
              variant="outlined"
              sx={{
                color: 'white',
                borderRadius: '30px',
                backgroundColor: '#373737',
                // fontSize: '14px',
                // padding: '6px 16px',
                border: '1px solid #383838',
              }}
            >
              Upload
            </ZuButton>
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
              onClick={updateSpace}
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
      <EventHeader />
      <CurrentEvents onToggle={toggleDrawer} />
      <PastEvents />
      <Invite />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '111px',
            height: 'calc(100% - 111px)',
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
    </Box>
  );
};

export default Event;
