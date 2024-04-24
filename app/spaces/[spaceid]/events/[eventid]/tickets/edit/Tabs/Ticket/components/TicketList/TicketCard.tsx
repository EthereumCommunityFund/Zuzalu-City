import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import {
  ThreeVerticalIcon,
  CheckCircleIcon,
  EyeSlashIcon,
} from 'components/icons';

export type TicketCardProps = {
  name: string;
  price: string;
  open: string;
  status: boolean;
  sold: number;
};

const TicketCard: React.FC<TicketCardProps> = ({
  name,
  price,
  open,
  status,
  sold,
}) => {
  return (
    <Stack
      direction="column"
      spacing={1}
      borderRadius={2}
      padding={1.5}
      bgcolor="#2d2d2d"
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <Typography variant="h5" color="white">
            {name}
          </Typography>{' '}
          &nbsp;&nbsp;&nbsp;
          <Typography variant="body1" color="white">
            {price}
          </Typography>
        </Stack>
        <ZuButton
          startIcon={<ThreeVerticalIcon />}
          sx={{
            padding: 0,
            minWidth: 0,
            '& .MuiButton-startIcon': { margin: 0 },
          }}
        />
      </Stack>
      <Typography color="white">{open}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack
          direction="row"
          alignItems="center"
          padding="4px 10px"
          spacing={1}
          borderRadius={3}
          sx={{ backgroundColor: '#384A44' }}
        >
          {status ? (
            <CheckCircleIcon color="#65C0A0" />
          ) : (
            <EyeSlashIcon color="#C09965" />
          )}
          <Typography color={status ? '#65C0A0' : '#C09965'}>
            {status ? 'Available' : 'Hidden'}
          </Typography>
        </Stack>
        <Typography color="white">Sold: {sold}</Typography>
      </Stack>
    </Stack>
  );
};

export default TicketCard;
