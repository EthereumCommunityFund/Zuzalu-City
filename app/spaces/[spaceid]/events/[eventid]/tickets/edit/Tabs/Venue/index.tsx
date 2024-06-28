import React, { useState } from 'react';
import {
  Stack,
  SwipeableDrawer,
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import { PreviewFile } from '@/components';
import { createConnector } from '@lxdao/uploader3-connector';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import { VenueHeader, VenueList } from './components';
import {
  XMarkIcon,
  ArchiveBoxIcon,
  SearchIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
} from '@/components/icons';
import BpCheckbox from '@/components/event/Checkbox';
import TextEditor from '@/components/editor/editor';
import { MOCK_DATA } from '@/mock';
import { ZuButton, ZuInput } from '@/components/core';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Custom_Option: TimeStepOptions = {
  hours: 1,
  minutes: 30,
};

const Venue: React.FC = () => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const List = (anchor: Anchor) => {
    const [avatar, setAvatar] = useState<SelectedFile>();
    const [avatarURL, setAvatarURL] = useState<string>();
    const connector = createConnector('NFT.storage', {
      token: process.env.NEXT_PUBLIC_CONNECTOR_TOKEN ?? '',
    });

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            height="50px"
            borderBottom="1px solid #383838"
            paddingX={3}
            gap={2}
          >
            <ZuButton
              startIcon={<XMarkIcon />}
              onClick={() => toggleDrawer('right', false)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              Close
            </ZuButton>
            <Typography variant="subtitleSB">Venue Spaces</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitleMB">Create a Venue</Typography>
              <ZuButton
                startIcon={<ArchiveBoxIcon size={5} />}
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Save Draft
              </ZuButton>
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Venue Space Details</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Space Name*</Typography>
                <ZuInput placeholder="Standard Pass" />
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Space Tags</Typography>
                  <Typography variant="bodyS">
                    Search or create categories related to your space
                  </Typography>
                </Stack>
                <FormControl focused sx={{ border: 'none' }}>
                  <OutlinedInput
                    placeholder="Search or add a tag"
                    sx={{
                      backgroundColor:
                        'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
                      paddingX: '15px',
                      paddingY: '13px',
                      borderRadius: '10px',
                      height: '35px',
                      border:
                        '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
                      fontFamily: 'Inter',
                      opacity: 0.7,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Stack direction="row" spacing="10px">
                  <Stack
                    direction="row"
                    spacing="10px"
                    alignItems="center"
                    bgcolor="#313131"
                    borderRadius="10px"
                    padding="4px 10px"
                  >
                    <Typography variant="bodyMB">
                      Live-stream Available
                    </Typography>
                    <XMarkIcon size={4} />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="10px"
                    alignItems="center"
                    bgcolor="#313131"
                    borderRadius="10px"
                    padding="4px 10px"
                  >
                    <Typography variant="bodyMB">External Venue</Typography>
                    <XMarkIcon size={4} />
                  </Stack>
                </Stack>
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Space Image</Typography>
                <Typography variant="bodyS">
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
                    accept={['.gif', '.jpeg', '.gif', '.png']}
                    connector={connector}
                    multiple={false}
                    crop={false} // must be false when accept is svg
                    onChange={(files: any) => {
                      setAvatar(files[0]);
                    }}
                    onUpload={(file: any) => {
                      setAvatar(file);
                    }}
                    onComplete={(result: any) => {
                      setAvatarURL(result?.url);
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
                  <PreviewFile
                    sx={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                    }}
                    file={avatarURL}
                  />
                </Box>
              </Stack>
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Available Bookings</Typography>
              <Typography variant="bodyBB">
                Your event timeframe: Month, 00, 2024 - Month, 00, 2024
              </Typography>
              <Stack spacing="20px">
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">MON</Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px" flex="4">
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">TUE</Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px" flex="4">
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">WED</Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px" flex="4">
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">THU</Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px" flex="4">
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">FRI</Typography>
                  </Stack>
                  <Stack direction="row" spacing="10px" flex="4">
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                    <TimePicker
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#313131',
                          borderRadius: '10px',
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            ...{
                              '& .MuiPickersDay-root': { color: 'black' },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#D7FFC4',
                              },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'black',
                              },
                              '& .MuiMultiSectionDigitalClock-root': {
                                color: 'black',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">SAT</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" flex="4">
                    <Typography>Unavailable</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing="20px">
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <BpCheckbox />
                    <Typography variant="bodyBB">SUN</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" flex="4">
                    <Typography>Unavailable</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing="20px"
                    alignItems="center"
                    flex="1"
                  >
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <PlusIcon size={5} />
                    </Stack>
                    <Stack padding="10px" sx={{ cursor: 'pointer' }}>
                      <MinusIcon size={5} />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Box display="flex" gap="20px">
              <ZuButton
                sx={{
                  flex: 1,
                }}
                startIcon={<XMarkIcon />}
              >
                Discard
              </ZuButton>
              <ZuButton
                sx={{
                  color: '#67DBFF',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                  flex: 1,
                }}
                startIcon={<PlusCircleIcon color="#67DBFF" />}
              >
                Add Space
              </ZuButton>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };

  return (
    <Stack spacing="30px">
      <VenueHeader onToggle={toggleDrawer} />
      {/* <VenueList venues={MOCK_DATA.venues} onToggle={toggleDrawer} /> */}
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
        {List('right')}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Venue;
