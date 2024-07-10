import React, { Dispatch, SetStateAction } from 'react';
import { Stack, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

type AvailableType = {
  startTime: string;
  endTime: string;
  error?: string;
};
interface ITimeRange {
  values: AvailableType[];
  id: number;
  setValues: Dispatch<SetStateAction<AvailableType[]>>;
}

const validateTimeRanges = (ranges: AvailableType[]) => {
  const errors = ranges.map((range, index) => {
    const startTime = new Date(range.startTime).getTime();
    const endTime = new Date(range.endTime).getTime();

    if (startTime >= endTime) {
      return { ...range, error: 'Start time must be before end time' };
    }

    for (let i = 0; i < ranges.length; i++) {
      if (i !== index) {
        const otherStartTime = new Date(ranges[i].startTime).getTime();
        const otherEndTime = new Date(ranges[i].endTime).getTime();
        if (
          (startTime < otherEndTime && startTime >= otherStartTime) ||
          (endTime > otherStartTime && endTime <= otherEndTime)
        ) {
          return { ...range, error: 'Time ranges overlap' };
        }
      }
    }

    return { ...range, error: '' };
  });

  return errors;
};

const TimeRange: React.FC<ITimeRange> = ({ id, setValues, values }) => {
  const currentRange = values[id];
  return (
    <Stack direction="column" spacing="10px" flex="4">
      <Stack direction="row" spacing="10px">
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
              setValues(validateTimeRanges(newValue));
            }
          }}
          value={currentRange.startTime ? dayjs(currentRange.startTime) : null}
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
              setValues(validateTimeRanges(newValue));
            }
          }}
          value={currentRange.endTime ? dayjs(currentRange.endTime) : null}
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
      {currentRange.error && (
        <Typography variant="body2" color="error">
          {currentRange.error}
        </Typography>
      )}
    </Stack>
  );
};

export default TimeRange;
