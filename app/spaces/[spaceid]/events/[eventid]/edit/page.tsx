'use client';
import { useState, ChangeEvent } from 'react';
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
import { PlusCircleIcon, PlusIcon, XMarkIcon } from 'components/icons';
import { EventHeader, CurrentEvents, PastEvents, Invite } from './components';
import { ZuButton } from 'components/core';
import { TextEditor } from '@/components/editor/editor';
import { useCeramicContext } from '@/context/CeramicContext';
import { PreviewFile } from '@/components';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import BpCheckbox from '../components/Checkbox';
import { OutputData } from '@editorjs/editorjs';

const CircleCheckbox = styled(Checkbox)({
  borderRadius: '50px',
  border: '10px solid green',
  '&.Mui-checked': {
    color: '#f50057',
  },
});

interface Inputs {
  name: string;
  tagline: string;
}

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

  console.log("ceramic", ceramic)


  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => {
    const [person, setPerson] = useState(true);
    const [online, setOnline] = useState(false);
    const [inputs, setInputs] = useState<Inputs>({
      name: '',
      tagline: '',
    });
    const [description, setDescription] = useState<OutputData>();
    const [avatar, setAvatar] = useState<SelectedFile>();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value
      }));
    };

    const handleClose = () => {
      toggleDrawer('right', false);
    };

    const updateSpace = async () => {
      const update = await composeClient.executeQuery(`
      mutation {
        createEvent(
          input: {
            content: {
              title: "${inputs.name}",
              description: "${description}",
              startTime: ""2024-09-09T00:00:00Z"",
              endTime: ""2024-09-010T00:00:00Z"",
              spaceId: "",
              createdAt: ""2024-08-09T00:00:00Z"",
              profileId: "${profile?.id}",
              max_participant: 100,
              min_participant: 10,
              participant_count: 10,
              external_url: "",
              image_url: "${avatar?.previewUrl}",
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
      console.log(update)
    };
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
            <Typography
              color="white"
              fontSize="18px"
              fontWeight={700}
              fontFamily="Inter"
            >
              Create Event
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Box bgcolor="#2d2d2d" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Event Basic
                </Typography>
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                <Box>
                  <Typography
                    color="white"
                    fontSize="18px"
                    fontWeight={700}
                    fontFamily="Inter"
                  >
                    Event Description
                  </Typography>
                  <Typography color="white" variant="caption">
                    This is a description greeting for new members. You can also
                    update descriptions.
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
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Space Avatar
                </Typography>
                <Typography
                  color="white"
                  fontSize="13px"
                  fontWeight={500}
                  fontFamily="Inter"
                >
                  Recommend min of 200x200px (1:1 Ratio)
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Uploader3
                    accept={['.gif', '.jpeg', '.gif']}
                    api={'/api/upload/file'}
                    multiple={false}
                    crop={false} // must be false when accept is svg
                    onChange={(files) => {
                      setAvatar(files[0]);
                    }}
                    onUpload={(file: any) => {
                      setAvatar(file);
                    }}
                    onComplete={(file: any) => {
                      setAvatar(file);
                    }}
                  >
                    <Button
                      component="span"
                      sx={{
                        color: 'white',
                        borderRadius: '10px',
                        backgroundColor: '#373737',
                        border: '1px solid #383838',
                      }}
                    >
                      Upload
                    </Button>
                  </Uploader3>
                  <PreviewFile file={avatar} />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  gap="20px"
                  // borderTop="1px solid #383838"
                  // borderBottom="1px solid #383838"
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
                  Event Format
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                gap="20px"
                padding="20px"
              >
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
                    Location
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
                  endIcon={<PlusIcon />}
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
            <Box bgcolor="#2d2d2d" borderRadius="10px">
              <Box padding="20px" display="flex" justifyContent="space-between">
                <Typography
                  color="white"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Inter"
                >
                  Links
                </Typography>
              </Box>
              <Box
                padding="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
                <Button
                  sx={{
                    color: 'white',
                    borderRadius: '30px',
                    backgroundColor: '#373737',
                    fontSize: '14px',
                    padding: '6px 16px',
                    border: '1px solid #383838',
                  }}
                  endIcon={<PlusCircleIcon />}
                >
                  Add Link
                </Button>
              </Box>
            </Box>
            <Box display="flex" gap="20px">
              <Button
                sx={{
                  color: 'white',
                  borderRadius: '10px',
                  backgroundColor: '#373737',
                  fontSize: '14px',
                  padding: '6px 16px',
                  border: '1px solid #383838',
                  flex: 1,
                }}
                startIcon={<XMarkIcon />}
              >
                Discard
              </Button>
              <Button
                sx={{
                  color: '#67DBFF',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                  fontSize: '14px',
                  padding: '6px 16px',
                  flex: 1,
                  border: '1px solid rgba(103, 219, 255, 0.20)',
                }}
                startIcon={<PlusCircleIcon color="#67DBFF" />}
                onClick={updateSpace}
              >
                Create Event
              </Button>
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
