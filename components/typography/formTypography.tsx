import { Typography } from '@mui/material';
import React from 'react';

export const FormTitle = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Typography variant="subtitleMB" color="text.secondary">
      {children}
    </Typography>
  );
};

export const FormLabel = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Typography variant="bodyBB" color="white">
      {children}
    </Typography>
  );
};

export const FormLabelDesc = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Typography variant="bodyS" color="text.secondary">
      {children}
    </Typography>
  );
};
