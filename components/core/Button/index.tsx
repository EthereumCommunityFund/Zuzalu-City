import { styled, Button, ButtonProps } from '@mui/material';

interface ZuButtonProps extends ButtonProps {
  zuvariant?: string;
}

const ZuButtonContained = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.dark,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const ZuButtonOutlined = styled(Button)(({ theme }) => ({}));

const ZuButton = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: '10px', // Example style
  textTransform: 'none',
  height: 'fit-content',
  width: 'fit-content',
  boxShadow: 'none',
  backgroundColor: '#2e2e2e',
  // Override default styles if needed
  '&.MuiButton-disabled': {
    color: '#2d2d2d',
  },
  '&.MuiButton-startIcon': {
    margin: 0,
  },
}));

export default ZuButton;
