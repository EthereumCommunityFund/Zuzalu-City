import React from 'react';
import dayjs from 'dayjs';
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

type SessionCardProps = {
  title?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
};

const SessionCard: React.FC<SessionCardProps> = ({
  title = 'Opening Meetup (some game to get to know the coworking space + hotels)',
  startTime = '00:00 AM',
  endTime = '00:00 AM',
  location = 'GROUND FLOOR THEATER',
}) => {
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
        <Typography variant="bodyB">
          {dayjs(startTime).format('HH A')} - {dayjs(endTime).format('HH A')}
        </Typography>
        <EditIcon />
      </Stack>
      <Typography variant="subtitleSB">{title}</Typography>
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
        <Typography variant="caption">{location}</Typography>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
