import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon } from 'components/icons';

const SessionAdd = () => {
  return (
    <Stack direction="column" spacing={0.5}>
      
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#2d2d2d"
        padding="20px 10px"
        borderRadius={2}
      >
        <PlusCircleIcon color="#6c6c6c" size={15} />
        <Typography variant="body2">Add your First Session</Typography>
      </Stack>
    </Stack>
  );
};

export default SessionAdd;
