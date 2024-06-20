import React, { Dispatch, SetStateAction } from 'react';
import { Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

type AvailableType = {
  startTime: string;
  endTime: string;
};
interface ITimeRange {
  values: AvailableType[];
  id: number;
  setValues: Dispatch<SetStateAction<AvailableType[]>>;
}
const TimeRange: React.FC<ITimeRange> = ({ id, setValues, values }) => {
  return (
    <Stack direction="row" spacing="10px" flex="4">
      <TimePicker
        onChange={(value) => {
          if (value) {
            const newValue = values.map((item, index) => {
              if (index === id) {
                item.startTime = value.toString();
                return item;
              }
              return item;
            });
            setValues(newValue);
          }
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
          if (value) {
            const newValue = values.map((item, index) => {
              if (index === id) {
                item.endTime = value.toString();
                return item;
              }
              return item;
            });
            setValues(newValue);
          }
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
  );
};

export default TimeRange;
