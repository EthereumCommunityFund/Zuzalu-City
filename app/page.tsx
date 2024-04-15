'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { RightArrowCircleIcon, SpaceIcon, RightArrowIcon, EventIcon } from '../components/icons';
import { SpaceCard, EventCard, LotteryCard } from '../components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

const Home: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box borderLeft="1px solid grey" flexGrow={1} padding='30px'>
        <Box height='240px' borderRadius='10px'padding='40px 25px'
          sx={{
            backgroundImage: 'url("4.webp")', 
            backgroundPosition: "center center"
          }}>
          <Typography color='white' fontWeight={700} fontSize='61px'>Zuzalu City</Typography>
          <Typography color='white' fontSize='16px' fontWeight={600} marginBottom='20px'>Welcome to the new Zuzalu City</Typography>
          <Button sx={{backgroundColor: '#383838', color: 'white', fontWeight: 700, width: '200px', borderRadius: '10px', padding: '10px 14px'}} startIcon={<RightArrowIcon />}>Learn About v2</Button>
        </Box>
        {/* <Typography color='grey' fontSize='14px' fontWeight={500} sx={{fontStyle: 'italic'}} marginTop="30px">
          Prototype Note: Click-able things will usually be the first objects in a list or row.
        </Typography> */}
        <Box marginTop='30px'>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box display='flex' alignItems='center' gap='10px'>
              <SpaceIcon />
              <Typography color='white' fontSize='25px' fontWeight={700}>Explore Spaces</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='10px'>
              <Typography color='white' fontSize='14px' fontWeight={400}>View All Spaces</Typography>
              <RightArrowCircleIcon />
            </Box>
          </Box>
          <Box marginY='20px'>
            <Typography color='white' fontSize='14px' fontWeight={400}>Most Active Spaces</Typography>
          </Box>
          <Box display='flex' gap='30px'>
            <SpaceCard bgImage='5.webp' logoImage='1.webp' />
            <SpaceCard bgImage='7.webp' logoImage='8.webp' />
            <SpaceCard bgImage='9.webp' logoImage='0.webp' />
            <SpaceCard bgImage='10.webp' logoImage='11.webp' />
            {/* <SpaceCard bgImage='5.webp' logoImage='1.webp' />
            <SpaceCard bgImage='7.webp' logoImage='8.webp' />
            <SpaceCard bgImage='9.webp' logoImage='0.webp' />
            <SpaceCard bgImage='10.webp' logoImage='11.webp' /> */}
          </Box>
          <LotteryCard />
          <Box display='flex' gap='20px'>
            <Box flexGrow={1} display='flex' flexDirection='column' gap='20px'>
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' gap='10px'>
                  <EventIcon />
                  <Typography color='white' fontSize='25px' fontWeight={700}>
                    Events
                  </Typography>
                </Box>
                <Box display='flex' alignItems='center' gap='10px'>
                  <Typography color='white' fontSize='16px' fontWeight={400}>View All Events</Typography>
                  <RightArrowCircleIcon />
                </Box>
              </Box>
              <Typography 
                color='white' align='center' 
                border='1px solid rgba(255, 255, 255, 0.10)'
                padding='8px 14px'
                borderRadius='40px'
                fontSize='18px' fontWeight={600}
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
            <Box width='360px' display='flex' flexDirection='column' gap='20px'>
              <Typography color='white' fontSize='18px' fontWeight={600} padding='20px 10px' borderBottom='1px solid rgba(255, 255, 255, 0.10)'>Sort & Filter Sessions</Typography>
              <Box display='flex' gap='4px' padding='2px' borderRadius='10px' bgcolor='#2d2d2d'>
                <Button sx={{flex: 1, backgroundColor: '#424242', borderRadius: '8px', color: 'white'}}>Upcoming</Button>
                <Button sx={{flex: 1, backgroundColor: '#2d2d2d', borderRadius: '8px', color: 'white'}}>Past</Button>
              </Box>
              <Box>
                <DateCalendar defaultValue={dayjs('2022-04-17')} sx={{
                  '& .mui-s6c4tz-MuiButtonBase-root-MuiPickersDay-root': {
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 500
                  },
                  '& .mui-1aqny2q-MuiPickersCalendarHeader-root': {
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 700
                  },
                  '& .mui-dplwbx-MuiPickersCalendarHeader-label' : {
                    fontSize: '20px',
                    fontWeight: 700
                  },
                  '& .mui-1vooibu-MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '& .mui-3xxbjo-MuiTypography-root-MuiDayCalendar-weekDayLabel': {
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 500
                  },
                  '& .mui-s6c4tz-MuiButtonBase-root-MuiPickersDay-root.Mui-selected': {
                    backgroundColor: 'rgba(215, 255, 196, 0.20)',
                    color: '#D7FFC4'
                  }
                }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider> 
  )
};

export default Home;
