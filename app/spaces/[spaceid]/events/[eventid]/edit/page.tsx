'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  SwipeableDrawer,
  Checkbox,
  styled,
  Stack,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { XMarkIcon } from 'components/icons';
import { EventHeader, CurrentEvents, PastEvents, Invite } from './components';
import { ZuButton } from 'components/core';
import { TextEditor } from '@/components/editor/editor';
import { useCeramicContext } from '@/context/CeramicContext';
import BpCheckbox from '../components/Checkbox';

const CircleCheckbox = styled(Checkbox)({
  borderRadius: '50px',
  border: '10px solid green',
  '&.Mui-checked': {
    color: '#f50057',
  },
});

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

  const updateSpace = async () => {
    const update = await composeClient.executeQuery(`
  mutation  {
    createEvent(
      input: {content: {title: "", endTime: "", spaceId: "", createdAt: "", profileId: "", startTime: "", max_participant: 10, min_participant: 10, participant_count: 10, description: "", external_url: "", image_url: "", meeting_url: "", status: "", timezone: ""}}
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

  const list = (anchor: Anchor) => {
    const [person, setPerson] = useState(false);
    const [online, setOnline] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file && file.type.substr(0, 5) === 'image') {
        setImage(file);
      } else {
        setImage(null);
      }
    };

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file && file.type.substr(0, 5) === 'image') {
        setBanner(file);
      } else {
        setBanner(null);
      }
    };

    const handleClose = () => {
      toggleDrawer('right', false);
      setImage(null);
      setBanner(null);
    };

    useEffect(() => {
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(image);
      } else {
        setImagePreview(null);
      }
    }, [image]);

    useEffect(() => {
      if (banner) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerPreview(reader.result as string);
        };
        reader.readAsDataURL(banner);
      } else {
        setBannerPreview(null);
      }
    }, [banner]);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
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
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
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
                  <TextEditor
                    holder="Write"
                    placeholder="Write a short, one-sentence tagline for your event"
                    sx={{
                      backgroundColor: '#ffffff0d',
                      fontFamily: 'Inter',
                      color: 'white',
                      padding: '12px 12px 12px 80px',
                      borderRadius: '10px',
                    }}
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
                    <DatePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
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
                    <DatePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
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
                      bgcolor={person ? '#484E45' : '#373737'}
                      borderRadius="10px"
                      padding="10px"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      flex={1}
                    >
                      {/* <CircleCheckbox /> */}
                      <BpCheckbox
                        checked={person}
                        onChange={() => {
                          setPerson((prev) => !prev);
                          setOnline((prev) => !prev);
                        }}
                      />
                      <Stack>
                        <Typography
                          color="white"
                          fontSize="16px"
                          fontWeight={600}
                          fontFamily="Inter"
                        >
                          In-Person
                        </Typography>
                        <Typography
                          color="white"
                          fontSize="10px"
                          fontFamily="Inter"
                        >
                          This is a physical event
                        </Typography>
                      </Stack>
                    </Box>
                    <Box
                      bgcolor={online ? '#484E45' : '#373737'}
                      borderRadius="10px"
                      padding="10px"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      flex={1}
                    >
                      <BpCheckbox
                        checked={online}
                        onChange={() => {
                          setPerson((prev) => !prev);
                          setOnline((prev) => !prev);
                        }}
                      />
                      <Stack>
                        <Typography
                          color="white"
                          fontSize="16px"
                          fontWeight={600}
                          fontFamily="Inter"
                        >
                          Online
                        </Typography>
                        <Typography
                          color="white"
                          fontSize="10px"
                          fontFamily="Inter"
                        >
                          Specially Online Event
                        </Typography>
                      </Stack>
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
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="10px"
              >
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
                <Input
                  type="file"
                  onChange={handleImageChange}
                  sx={{ display: 'none' }}
                  id="raised-button-file"
                />
                <Box component="label" htmlFor="raised-button-file">
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '30px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                    }}
                  >
                    Upload
                  </Button>
                </Box>
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    width="200px"
                    height="200px"
                  />
                ) : (
                  <Box
                    width="200px"
                    height="200px"
                    bgcolor="#373737"
                    borderRadius="20px"
                  />
                )}
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
                <Input
                  type="file"
                  onChange={handleBannerChange}
                  sx={{ display: 'none' }}
                  id="banner-button-file"
                />
                <Box component="label" htmlFor="banner-button-file">
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '30px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                    }}
                  >
                    Upload
                  </Button>
                </Box>
                {bannerPreview ? (
                  <Box
                    component="img"
                    src={bannerPreview}
                    width="200px"
                    height="200px"
                  />
                ) : (
                  <Box
                    width="100%"
                    height="200px"
                    bgcolor="#373737"
                    borderRadius="20px"
                  />
                )}
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
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
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
      </LocalizationProvider>
    );
  };
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
