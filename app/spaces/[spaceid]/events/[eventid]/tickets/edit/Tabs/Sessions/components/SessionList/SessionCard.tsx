import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { EditIcon, MapIcon } from 'components/icons';

const speakers = [
  {
    name: 'QJ',
    avatar: '/qj.webp',
  },
  {
    name: 'Kelly Liu',
    avatar: '/kelly.webp',
  },
  {
    name: 'Simon Fast',
  },
];

const SessionCard = () => {
  return (
    <Stack
      direction={'column'}
      spacing={1}
      padding={1}
      borderRadius={'10px'}
      sx={{
        ':hover': {
          backgroundColor: '#383838',
        },
      }}
    >
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant="bodyB">00:00 AM - 00:00 AM</Typography>
        <EditIcon />
      </Stack>
      <Typography variant="subtitleSB">
        Opening Meetup (some game to get to know the coworking space + hotels)
      </Typography>
      <Stack direction={'row'} spacing={1}>
        <Typography variant="bodyS">Speakers:</Typography>
        {speakers.map((speaker, index) => (
          <Stack
            key={`Speaker-${index}`}
            direction={'row'}
            spacing={0.5}
            alignItems={'center'}
          >
            {speaker.avatar && (
              <Box
                component={'img'}
                height={20}
                width={20}
                borderRadius={10}
                src={speaker.avatar}
              />
            )}
            <Typography variant="bodyS">{speaker.name}</Typography>
          </Stack>
        ))}
      </Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <MapIcon size={4} />
        <Typography variant="caption">GROUND FLOOR THEATER</Typography>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
