'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Typography, Button } from '@mui/material';
import { Header, Sidebar, IconSidebar } from './components';
import { ZuButton } from 'components/core';
import { CalendarIcon, EventIcon, HomeIcon, ListIcon } from 'components/icons';
import { EventCard } from 'components';
import { MOCK_DATA } from 'mock';

const Home = () => {
  const router = useRouter();

  return (
    <Stack direction='row'>
      <IconSidebar />
      <Sidebar />
      <Stack flex={1}>
        <Header />
        <Stack direction='row' justifyContent='center' >
          <Stack width="80%"  direction='row' spacing={2} bgcolor="#2d2d2d" padding={1}>
            <ZuButton variant='contained'>Create Event</ZuButton>
            <ZuButton variant='contained' onClick={() => router.push('/spaces/123/events/456/edit')}>Manage Event</ZuButton>
          </Stack>
        </Stack>
        <Stack paddingX={20} paddingY={1} spacing={3}>
          <Stack direction='row' justifyContent='end'>
            <Stack
              width='content-fit' 
              direction='row'
              padding="2px"
              borderRadius="10px"
              bgcolor="#2d2d2d"
            >
               <ZuButton
                startIcon={<ListIcon />}
                sx={{
                  backgroundColor: '#424242',
                  '& .MuiButton-startIcon': {
                    margin: 0
                  }
                }}
              />
              <ZuButton
                startIcon={<EventIcon />}
                sx={{
                  backgroundColor: '#2d2d2d',
                }}
              />
            </Stack>
          </Stack>
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
        </Stack>
        <Stack paddingX={20}>
          <EventCard {...MOCK_DATA.events[0]} />
          <ZuButton startIcon={<CalendarIcon />}>Eth Imrpov</ZuButton>
          <EventCard {...MOCK_DATA.events[1]} />
          <Stack direction='row' spacing={1}>
            <ZuButton startIcon={<HomeIcon />}>12 side events around HackZuzalu ChiangMai</ZuButton>
            <ZuButton startIcon={<CalendarIcon />}>HackZuzalu</ZuButton>
          </Stack>
          <EventCard {...MOCK_DATA.events[2]} />
          <ZuButton startIcon={<CalendarIcon />}>ZuCity Meetings</ZuButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Home;