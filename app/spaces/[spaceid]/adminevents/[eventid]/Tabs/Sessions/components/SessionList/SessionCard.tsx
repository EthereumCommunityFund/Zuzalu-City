import React from 'react';
import dayjs from 'dayjs';
import { Stack, Typography, Box } from '@mui/material';
import { EditIcon, MapIcon, SessionIcon } from 'components/icons';
import { Session } from '@/types';

type SessionCardProps = {
  session: Session
};

const SessionCard: React.FC<SessionCardProps> = ({
  session
}) => {
  return (
    <Stack
      direction="row"
      padding="10px 10px 20px 10px"
      borderRadius={'10px'}
      sx={{
        ':hover': {
          backgroundColor: '#383838',
        },
        cursor: "pointer"
      }}
    >
      <Stack spacing="10px" flex={1}>
        <Stack direction="row" spacing="10px" alignItems="center">
          <Typography bgcolor="#7DFFD11A" padding="2px 4px" color="#7DFFD1" variant="bodyX" borderRadius="2px">
            · LIVE
          </Typography>
          <Typography variant="caption">
            TRACK
          </Typography>
        </Stack>
        <Typography variant="bodyB">
          {dayjs(session.startTime).format('h:mm A')} - {dayjs(session.endTime).format('h:mm A')}
        </Typography>
        <Typography variant="subtitleSB">{session.title}</Typography>
        <Stack direction={'row'} spacing={1} alignItems="center">
          <Typography variant="bodyS" sx={{ opacity: 0.7 }}>Speakers:</Typography>
          {JSON.parse(session.speakers).map((speaker: any, index: number) => (
            <Stack
              key={`Speaker-${index}`}
              direction={'row'}
              spacing={0.5}
              alignItems={'center'}
            >
              <Box
                component={'img'}
                height={20}
                width={20}
                borderRadius={10}
                src={speaker.avatar || "/16.jpg"}
              />
              <Typography variant="bodyS">{speaker.username}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <MapIcon size={4} />
          <Typography variant="caption" sx={{ opacity: 0.5 }}>{session.location}</Typography>
        </Stack>
      </Stack>
      <Stack padding="4px" spacing="4px" direction="row" alignItems="center" borderRadius="8px" sx={{ opacity: 0.7 }}
        bgcolor="rgba(255, 255, 255, 0.05)" height="fit-content">
        <SessionIcon />
        <Typography variant="bodyS">
          1
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
