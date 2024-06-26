import React, { Dispatch, SetStateAction, useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface PropTypes {
  selectedDate: Date
  setSelectedDate: Dispatch<SetStateAction<Date>>
}

const CalendarNavigator = ({selectedDate, setSelectedDate}: PropTypes) => {

  const handlePrevDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const renderDates = () => {
    const dates = [];
    for (let i = -2; i <= 1; i++) {
      const date = addDays(selectedDate, i + 2);
      const isSelected = isSameDay(date, selectedDate);
      dates.push(
        <Typography
          key={i}
          onClick={() => handleDateClick(date)}
          style={{
            color: isSelected ? 'white' : 'gray',
            fontWeight: isSelected ? 'bold' : 'normal',
            cursor: 'pointer',
            flex: 1,
            textAlign: 'center'
          }}
        >
          {format(date, 'E · dd MMM yyyy')}
        </Typography>
      );
    }
    return dates;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="black"
    >
      <IconButton onClick={handlePrevDay} style={{ color: 'white' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <Box display="flex" justifyContent="space-between" width="100%">
        {renderDates()}
      </Box>
      <IconButton onClick={handleNextDay} style={{ color: 'white' }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default CalendarNavigator;