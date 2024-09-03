import React, { Dispatch, SetStateAction } from 'react';
import { Stack, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { AvailableType } from '@/types';

interface ITimeRange {
  values: AvailableType[];
  id: number;
  setValues: Dispatch<SetStateAction<AvailableType[]>>;
  timezone: string;
}

const validateTimeRanges = (
  timeRanges: AvailableType[],
  setValues: Dispatch<SetStateAction<AvailableType[]>>,
) => {
  const isOverlapping = (range1: AvailableType, range2: AvailableType) => {
    return (
      range1.startTime < range2.endTime && range2.startTime < range1.endTime
    );
  };

  // First, check each time range for validity (start time should be before end time)
  for (let i = 0; i < timeRanges.length; i++) {
    const { startTime, endTime } = timeRanges[i];
    if (startTime >= endTime) {
      timeRanges[i].error =
        `Time range ${i + 1} is invalid as start time ${startTime} is not before end time ${endTime}`;
    } else {
      timeRanges[i].error = '';
    }
  }

  // Second, check for overlaps
  for (let i = 0; i < timeRanges.length; i++) {
    for (let j = i + 1; j < timeRanges.length; j++) {
      if (isOverlapping(timeRanges[i], timeRanges[j])) {
        timeRanges[i].error =
          `Time range ${i + 1} overlaps with time range ${j + 1}`;
        timeRanges[j].error =
          `Time range ${j + 1} overlaps with time range ${i + 1}`;
      } else {
        timeRanges[i].error = ``;
        timeRanges[j].error = ``;
      }
    }
  }

  setValues(timeRanges);
};

const TimeRange: React.FC<ITimeRange> = ({
  id,
  setValues,
  values,
  timezone,
}) => {
  const currentRange = values[id];
  const startTime = currentRange.startTime
    ? dayjs.utc(currentRange.startTime, 'HH:mm').tz(timezone)
    : null;
  const endTime = currentRange.endTime
    ? dayjs.utc(currentRange.endTime, 'HH:mm').tz(timezone)
    : null;
  return (
    <Stack direction="column" spacing="10px" flex="4">
      <Stack direction="row" spacing="10px">
        <TimePicker
          ampm={false}
          onChange={(value) => {
            if (value) {
              const newValue = values.map((item, index) => {
                if (index === id) {
                  item.startTime = dayjs(value)
                    .utc()
                    .format('HH:mm')
                    .toString();
                  return item;
                }
                return item;
              });
              if (values[id].endTime) {
                validateTimeRanges(newValue, setValues);
              } else {
                setValues(newValue);
              }
            }
          }}
          value={startTime}
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
          ampm={false}
          onChange={(value) => {
            if (value) {
              const newValue = values.map((item, index) => {
                if (index === id) {
                  item.endTime = dayjs(value).utc().format('HH:mm').toString();
                  return item;
                }
                return item;
              });
              validateTimeRanges(newValue, setValues);
            }
          }}
          value={endTime}
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
