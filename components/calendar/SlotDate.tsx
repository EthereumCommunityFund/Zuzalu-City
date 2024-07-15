import { Badge } from '@mui/material';
import {
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers/PickersDay/PickersDay';
import { Dayjs } from 'dayjs';

export default function SlotDate(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] },
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      overlap="circular"
      badgeContent={
        isSelected
          ? highlightedDays.filter((date) => date === props.day.date()).length >
            1
            ? '..'
            : '.'
          : undefined
      }
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > span': {
          fontSize: '30px',
          fontWeight: '1000',
          right: '20px',
          top: '5px',
          color: '#D7FFC4',
          zIndex: 0,
        },
        '& > button': {
          zIndex: 1,
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}
