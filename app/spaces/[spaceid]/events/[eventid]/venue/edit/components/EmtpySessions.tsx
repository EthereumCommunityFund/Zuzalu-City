import { Stack, Typography } from '@mui/material';
import { PlusCircleIcon } from 'components/icons';

export const EmtpySessions = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px 10px',
        alignItems: 'center',
        boxSizing: 'border-box',
        backgroundColor: '#dddddd0d',
        borderRadius: '10px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Stack
        sx={{
          opacity: '0.3',
        }}
      >
        <PlusCircleIcon size={15} />
      </Stack>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
        }}
      >
        <Typography fontSize={'16px'} fontWeight={600} sx={{ opacity: '0.8' }}>
          No Locations
        </Typography>
        <Typography
          fontSize={'13px'}
          lineHeight={'120%'}
          sx={{ opacity: '0.8' }}
        >
          Add a location
        </Typography>
      </Stack>
    </Stack>
  );
};
