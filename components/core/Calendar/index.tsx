import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { styled } from '@mui/material';

const ZuCalendar = styled(DateCalendar)({
  // backgroundColor: '#424242',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)',
  '& .MuiDayCalendar-weekDayLabel': {
    color: 'white',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Inter',
  },
  '& .MuiPickersDay-dayWithMargin': {
    fontFamily: 'Inter',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .Mui-selected.MuiPickersDay-dayWithMargin': {
    backgroundColor: 'rgba(215, 255, 196, 0.20)',
    color: '#D7FFC4',
  },
  '& .MuiPickersYear-yearButton': {
    lineHeight: 1.75,
    fontSize: '1.25rem',
  },
});

export default ZuCalendar;
