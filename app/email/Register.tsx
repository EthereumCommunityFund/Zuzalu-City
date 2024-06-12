import React from 'react';
import { Stack, Typography, Box } from '@mui/material';

interface IProps {
  setIsInitial?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsDisclaimer?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsEmail?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsPayment?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsCompletion?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsRush?: React.Dispatch<React.SetStateAction<boolean>> | any;
}