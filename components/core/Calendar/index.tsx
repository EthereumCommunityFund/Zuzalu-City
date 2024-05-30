import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { styled } from "@mui/material"

const ZuCalendar = styled(DateCalendar)({
  '& .MuiButtonBase-root.MuiPickersDay-root.MuiPickersDay-dayWithMargin':
  {
    fontFamily: 'Inter',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
  },
  '& .MuiPickersCalendarHeader-root': {
    color: 'white',
    fontSize: '20px',
    fontWeight: 700,
  },
  '& .MuiDayCalendar-header': {
    color: 'white',
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: 700,
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiTypography-root.MuiTypography-caption.MuiDayCalendar-weekDayLabel':
  {
    color: 'white',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Inter',
  },
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected.MuiPickersDay-dayWithMargin':
  {
    backgroundColor:
      'rgba(215, 255, 196, 0.20)',
    color: '#D7FFC4',
  },
})

export default ZuCalendar;