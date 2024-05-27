import { styled, Input } from '@mui/material';

const ZuInput = styled(Input)(({ theme }) => ({
  color: 'white',
  backgroundColor: '#373737',
  padding: '5px 10px',
  borderRadius: '8px',
  width: '100%',
  fontSize: '15px',
  fontFamily: 'Inter',
  '&::after': {
    borderBottom: 'none',
  },
  '&::before': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled, .Mui-error):before': {
    borderBottom: 'none',
  },
}));

export default ZuInput;
