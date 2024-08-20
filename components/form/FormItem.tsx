import { Stack, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  title: string;
  desc?: string;
  required?: boolean;
}

export default function FormItem({
  title,
  desc,
  children,
  required = true,
}: IProps) {
  return (
    <Stack spacing="10px">
      <Typography variant="bodyBB">
        {title}
        {required ? '*' : ''}
      </Typography>
      {desc ? (
        <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
          {desc}
        </Typography>
      ) : null}
      {children}
    </Stack>
  );
}
