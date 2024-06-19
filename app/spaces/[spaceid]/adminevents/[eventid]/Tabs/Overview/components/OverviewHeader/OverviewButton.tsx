import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { PlusCircleIcon } from 'components/icons';

const BUTTON_GROUP = [
  {
    name: 'Create Session',
    description: 'Create Sessions for this event',
    icon: <PlusCircleIcon />,
  },
  {
    name: 'Scan QR',
    description: 'Scan atendee tickets',
    icon: <PlusCircleIcon />,
  },
];

type OverviewButtonProps = {
  type: number;
  onClick: () => void
};

const OverviewButton: React.FC<OverviewButtonProps> = ({ type, onClick }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      bgcolor="#383838"
      borderRadius={2}
      padding="5px 10px"
      spacing={1}
      flex={1}
      onClick={onClick}
    >
      {BUTTON_GROUP[type].icon}
      <Stack>
        <Typography variant="subtitle2" color="white">
          {BUTTON_GROUP[type].name}
        </Typography>
        <Typography variant="caption" color="white">
          {BUTTON_GROUP[type].description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default OverviewButton;
