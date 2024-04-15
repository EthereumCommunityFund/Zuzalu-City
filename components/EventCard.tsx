import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { MapIcon, LockIcon } from './icons';

const EventCard: React.FC = () => {
  return (
    <Box padding='10px' display='flex' gap='14px'>
      <Box component='img' width='150px' height='150px' src='4.webp' borderRadius='10px' />
      <Box display='flex' flexDirection='column' gap='10px' flexGrow={1}>
        <Box display='flex' alignItems='center' gap='10px'>
          <Box display='flex' alignItems='center' gap='6px'>
            <Box component='span' color='white' fontSize='10px' fontWeight={400}>BY:</Box>
            <Box component='img' width='18px' height='18px' src='0.webp' borderRadius='40px' />
            <Box component='span' color='white' fontSize='13px' fontWeight={500}>Zuzalu Contributor</Box>
          </Box>
          <Box component='span' color='white' fontSize='14px' fontWeight={500}>October 8 - October 20</Box>
        </Box>
        <Box>
          <Typography color='white' fontSize='25px' fontWeight={700}>HackZuzalu ChiangMai</Typography>
          <Typography color='white' fontSize='14px' fontWeight={500}>A Popup Village of Innovation in the Heart of Istanbul </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='6px'>
          <MapIcon />
          <Typography color='white' fontSize='10px' fontWeight={400}>ISTANBUL, TURKEY</Typography>
        </Box>
      </Box>
      <Box>
        <Box padding='4px 10px' flex='display' gap='4px' display='flex' alignItems='center' borderRadius='10px' bgcolor='#292929'>
          <LockIcon />
          <Typography color='white' fontSize='13px' fontWeight={600}>Gated</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default EventCard;