import { useTheme } from '@mui/material';
import { useMediaQuery as useMuiMediaQuery } from '@mui/material';
import { useState } from 'react';

const useMediaQuery = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMuiMediaQuery(breakpoints.down('sm'));
  return { isMobile };
};

const useDrawerState = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  return { state, setState };
};

export { useMediaQuery, useDrawerState };
