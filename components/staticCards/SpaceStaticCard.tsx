import { Stack, Typography } from '@mui/material';
import { TrafficConeIcon } from '../icons/TrafficCone';

export function SpaceStaticCard() {
  return (
    <Stack
      width={290}
      minWidth={290}
      borderRadius="10px"
      bgcolor="rgba(255, 255, 255, 0.02)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      minHeight={252}
      maxHeight={288}
      alignItems={'center'}
      justifyContent={'center'}
      gap={'10px'}
      px={'10px'}
    >
      <TrafficConeIcon />
      <Typography
        fontSize={'18px'}
        fontWeight={700}
        lineHeight={'120%'}
        color={'white'}
      >
        Spaces Coming Soon!
      </Typography>
      <Typography fontSize={'14px'} color={'white'} sx={{ opacity: '0.6' }}>
        Stay tuned for the launch of our beta
      </Typography>
    </Stack>
  );
}
