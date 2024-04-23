import { styled, Button } from '@mui/material';

const ZuButton = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: '10px', // Example style
  fontSize: 14,
  padding: '6px 10px',
  backgroundColor: '#383838', // Use theme for color consistency
  textTransform: 'none',
  fontFamily: 'Inter',

  '&:hover': {
    backgroundColor: '#4c4c4c', // Adjust on hover
  },

  // Override default styles if needed
  '&.MuiButton-disabled': {
    color: '#2d2d2d',
  },
}));

export default ZuButton;
