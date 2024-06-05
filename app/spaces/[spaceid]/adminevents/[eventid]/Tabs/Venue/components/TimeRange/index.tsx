import React from 'react';
import { Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface ITimeRange {
  id: number;
  setAvailableStart: (value: string[] | ((prevVar: string[]) => string[])) => void;
  setAvailableEnd: (value: string[] | ((prevVar: string[]) => string[])) => void;
}
const TimeRange: React.FC<ITimeRange> = ({ setAvailableStart, setAvailableEnd }) => {
  return (
    <Stack direction="row" spacing="10px" flex="4">
      <TimePicker
        onAccept={(value) => {
          if (value)
            setAvailableStart(prev => { prev.push(value.toString()); return prev })
        }}
        sx={{
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#313131',
            borderRadius: '10px',
          },
        }}
        slotProps={{
          popper: {
            sx: {
              ...{
                '& .MuiPickersDay-root': { color: 'black' },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#D7FFC4',
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: 'black',
                },
                '& .MuiMultiSectionDigitalClock-root': {
                  color: 'black',
                },
              },
            },
          },
        }}
      />
      <TimePicker
        onChange={(value) => {
          if (value)
            setAvailableEnd(prev => {
              prev.push(value.toString());
              return prev
            })
        }}
        sx={{
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#313131',
            borderRadius: '10px',
          },
        }}
        slotProps={{
          popper: {
            sx: {
              ...{
                '& .MuiPickersDay-root': { color: 'black' },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#D7FFC4',
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: 'black',
                },
                '& .MuiMultiSectionDigitalClock-root': {
                  color: 'black',
                },
              },
            },
          },
        }}
      />
    </Stack>
  )
}

export default TimeRange;

