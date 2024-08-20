import { Stack, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  title: string;
}

export default function FormGroup({ children, title }: IProps) {
  return (
    <Stack
      direction="column"
      spacing="30px"
      bgcolor="#262626"
      padding="20px"
      borderRadius="10px"
    >
      <Typography variant="subtitleMB">{title}</Typography>
      {children}
    </Stack>
  );
}
