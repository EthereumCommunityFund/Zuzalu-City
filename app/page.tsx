'use client';
import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Carousel from 'components/Carousel';
import { Header, Sidebar } from 'components/layout';
import {
  RightArrowCircleIcon,
  SpaceIcon,
  RightArrowIcon,
  EventIcon,
} from 'components/icons';
import { EventCard } from 'components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { MOCK_DATA } from 'mock';
import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();
const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  // const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <Header />
            <Box display="flex">
              {!isTablet && <Sidebar />}
              <Box
                borderLeft="1px solid #383838"
                flexGrow={1}
                padding={isMobile ? '10px' : '30px'}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  borderRadius="10px"
                  padding="40px 40px"
                  sx={{
                    backgroundImage: 'url("4.webp")',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                >
                  <Typography
                    color={theme.palette.text.primary}
                    variant={isMobile ? 'h1' : 'hB'}
                  >
                    Zuzalu City
                  </Typography>
                  <Typography color="white" variant="bodyB" marginBottom="20px">
                    Welcome to the new Zuzalu City
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#383838',
                      color: 'white',
                      width: isMobile ? '100%' : '200px',
                      borderRadius: '10px',
                    }}
                    startIcon={<RightArrowIcon />}
                  >
                    Learn About v2
                  </Button>
                </Box>
                <Box marginTop="30px">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap="10px">
                      <SpaceIcon />
                      <Typography
                        variant={isMobile ? 'subtitleMB' : 'subtitleLB'}
                        color="white"
                      >
                        Explore Spaces
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="10px">
                      <Typography color="white" variant="bodyM">
                        View All Spaces
                      </Typography>
                      <RightArrowCircleIcon />
                    </Box>
                  </Box>
                  <Box marginY="20px">
                    <Typography color="white" variant="bodyM">
                      Most Active Spaces
                    </Typography>
                  </Box>
                  <Carousel items={MOCK_DATA.spaces} />
                  {/* {isDesktop && <LotteryCard />} */}
                  <Box display="flex" gap="20px" marginTop="20px">
                    <Box
                      flexGrow={1}
                      display="flex"
                      flexDirection="column"
                      gap="20px"
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap="10px">
                          <EventIcon />
                          <Typography color="white" variant="subtitleLB">
                            Events
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="10px">
                          <Typography color="white" variant="bodyB">
                            View All Events
                          </Typography>
                          <RightArrowCircleIcon />
                        </Box>
                      </Box>
                      <Typography
                        color="white"
                        border="2px solid #383838"
                        align="center"
                        paddingY="8px"
                        borderRadius="40px"
                        variant="subtitleS"
                      >
                        October 2023
                      </Typography>
                      <Box>
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                      </Box>
                    </Box>
                    {!isTablet && (
                      <Box
                        width="360px"
                        display="flex"
                        flexDirection="column"
                        gap="20px"
                      >
                        <Typography
                          color="white"
                          variant="subtitleS"
                          padding="20px 10px"
                          borderBottom="1px solid #383838"
                        >
                          Sort & Filter Sessions
                        </Typography>
                        <Box
                          display="flex"
                          gap="4px"
                          padding="2px"
                          borderRadius="10px"
                          bgcolor="#2d2d2d"
                        >
                          <Button
                            sx={{
                              flex: 1,
                              backgroundColor: '#424242',
                              borderRadius: '8px',
                              color: 'white',
                              fontFamily: 'Inter',
                            }}
                          >
                            Upcoming
                          </Button>
                          <Button
                            sx={{
                              flex: 1,
                              backgroundColor: '#2d2d2d',
                              borderRadius: '8px',
                              color: 'white',
                              fontFamily: 'Inter',
                            }}
                          >
                            Past
                          </Button>
                        </Box>
                        <Box>
                          <DateCalendar
                            defaultValue={dayjs('2022-04-17')}
                            sx={{
                              '& .MuiButtonBase-root.MuiPickersDay-root.MuiPickersDay-dayWithMargin':
                                {
                                  fontFamily: 'Inter',
                                  color: 'white',
                                  fontSize: '16px',
                                  fontWeight: 500,
                                },
                              '& .MuiPickersCalendarHeader-root': {
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 700,
                              },
                              '& .MuiDayCalendar-header': {
                                color: 'white',
                                fontFamily: 'Inter',
                                fontSize: '20px',
                                fontWeight: 700,
                              },
                              '& .MuiSvgIcon-root': {
                                color: 'white',
                              },
                              '& .MuiTypography-root.MuiTypography-caption.MuiDayCalendar-weekDayLabel':
                                {
                                  color: 'white',
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  fontFamily: 'Inter',
                                },
                              '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected.MuiPickersDay-dayWithMargin':
                                {
                                  backgroundColor: 'rgba(215, 255, 196, 0.20)',
                                  color: '#D7FFC4',
                                },
                            }}
                          />
                        </Box>
                        {/* <Box>
                      <ZuSelect></ZuSelect>
                    </Box> */}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </LocalizationProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default Home;
