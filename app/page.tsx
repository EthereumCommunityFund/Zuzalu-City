'use client';
import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Carousel from 'components/Carousel';
import { Header, Sidebar } from 'components/Layout';
import {
  RightArrowCircleIcon,
  SpaceIcon,
  RightArrowIcon,
  EventIcon,
} from 'components/icons';
import { SpaceCard, EventCard, LotteryCard } from 'components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
// import ZuSelect from 'components/core/Select';

interface SpaceCardItem {
  bgImage: string;
  logoImage: string;
}

const items: SpaceCardItem[] = [
  {
    bgImage: '5.webp',
    logoImage: '1.webp',
  },
  {
    bgImage: '7.webp',
    logoImage: '8.webp',
  },
  {
    bgImage: '9.webp',
    logoImage: '0.webp',
  },
  {
    bgImage: '10.webp',
    logoImage: '11.webp',
  },
  {
    bgImage: '5.webp',
    logoImage: '1.webp',
  },
  {
    bgImage: '7.webp',
    logoImage: '8.webp',
  },
  {
    bgImage: '9.webp',
    logoImage: '0.webp',
  },
  {
    bgImage: '10.webp',
    logoImage: '11.webp',
  },
];

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Header />
        <Box display="flex">
          {!isTablet && <Sidebar />}
          <Box
            borderLeft="1px solid grey"
            flexGrow={1}
            padding={isMobile ? '10px' : '30px'}
          >
            <Box
              borderRadius="10px"
              padding="40px 25px"
              sx={{
                backgroundImage: 'url("4.webp")',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
            >
              <Typography
                color="white"
                fontWeight={700}
                fontSize={isMobile ? '54px' : '61px'}
                fontFamily="Inter"
              >
                Zuzalu City
              </Typography>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={400}
                marginBottom="20px"
                fontFamily="Inter"
              >
                Welcome to the new Zuzalu City
              </Typography>
              <Button
                sx={{
                  backgroundColor: '#383838',
                  color: 'white',
                  fontWeight: 700,
                  width: isMobile ? '100%' : '200px',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Inter',
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
                    color="white"
                    fontSize={isMobile ? '20px' : '25px'}
                    fontWeight={700}
                    fontFamily="Inter"
                  >
                    Explore Spaces
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <Typography
                    color="white"
                    fontSize="14px"
                    fontWeight={400}
                    fontFamily="Inter"
                  >
                    View All Spaces
                  </Typography>
                  <RightArrowCircleIcon />
                </Box>
              </Box>
              <Box marginY="20px">
                <Typography
                  color="white"
                  fontSize="14px"
                  fontWeight={400}
                  fontFamily="Inter"
                >
                  Most Active Spaces
                </Typography>
              </Box>
              <Carousel items={items} />
              {isDesktop && <LotteryCard />}
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
                      <Typography
                        color="white"
                        fontSize="25px"
                        fontWeight={700}
                        fontFamily="Inter"
                      >
                        Events
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="10px">
                      <Typography
                        color="white"
                        fontSize="16px"
                        fontWeight={400}
                        fontFamily="Inter"
                      >
                        View All Events
                      </Typography>
                      <RightArrowCircleIcon />
                    </Box>
                  </Box>
                  <Typography
                    color="white"
                    align="center"
                    border="2px solid rgba(255, 255, 255, 0.1)"
                    padding="8px 14px"
                    borderRadius="40px"
                    fontSize="18px"
                    fontWeight={600}
                    fontFamily="Inter"
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
                      fontSize="18px"
                      fontWeight={600}
                      padding="20px 10px"
                      borderBottom="1px solid rgba(255, 255, 255, 0.10)"
                      fontFamily="Inter"
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
  );
};

export default Home;
