import React, { useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { TimeView } from '@mui/x-date-pickers/models';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { ArrowDownIcon } from '@/components/icons';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Event } from '@/types';
import { FormItem } from '@/components/form/index';

dayjs.extend(timezone);

interface SessionDateDisplayProps {
  eventData: Event;
  control: Control<any>;
  handleDateChange: (date: Dayjs) => Promise<void>;
  isDateInRange: (date: Dayjs, startDate?: string, endDate?: string) => boolean;
  isTimeAvailable: (date: Dayjs, isStart: boolean) => boolean;
}

const SessionDateDisplay: React.FC<SessionDateDisplayProps> = ({
  eventData,
  control,
  handleDateChange,
  isDateInRange,
  isTimeAvailable,
}) => {
  const sessionLocation = useWatch({
    control,
    name: 'location',
  });
  const sessionDate = useWatch({ control, name: 'date' });
  const sessionStartTime = useWatch({ control, name: 'startTime' });
  const sessionEndTime = useWatch({ control, name: 'endTime' });
  const isPerson = useWatch({ control, name: 'isPerson' });

  const shouldDisableTime = useCallback(
    (date: Dayjs, view: TimeView): boolean => {
      if (sessionLocation === 'Custom') return false;
      if (view === 'hours') {
        let availableMinutes = 0;
        for (let minute = 0; minute < 60; minute += 5) {
          const checkTime = dayjs.tz(
            date.set('minute', minute),
            eventData?.timezone as string,
          );
          if (isTimeAvailable(checkTime, true)) {
            availableMinutes += 5;
          }
        }
        return availableMinutes < 5;
      } else if (view === 'minutes') {
        return !isTimeAvailable(
          dayjs.tz(date, eventData?.timezone as string),
          true,
        );
      }

      return false;
    },
    [eventData?.timezone, isTimeAvailable, sessionLocation],
  );

  const getCombinedValue = useCallback(
    (sessionDate: Dayjs, newValue: Dayjs) => {
      return dayjs
        .tz(sessionDate, eventData?.timezone)
        .set('hour', newValue.hour())
        .set('minute', newValue.minute());
    },
    [eventData?.timezone],
  );

  const hasLocation = isPerson ? sessionLocation : true;

  if (!hasLocation) return null;

  return (
    <>
      <Stack spacing="20px">
        <Stack spacing="10px">
          <FormItem
            title="Book a Date"
            desc="View and select the available dates and times for this location"
          >
            <>
              <Typography variant="bodyB">
                Your booking will be at the event timezone: {eventData.timezone}
              </Typography>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DesktopDatePicker
                    {...field}
                    onChange={(newValue: Dayjs | null) => {
                      if (newValue !== null) {
                        field.onChange(newValue);
                        handleDateChange(newValue);
                      }
                    }}
                    shouldDisableDate={(date: Dayjs) =>
                      !isDateInRange(
                        date,
                        eventData.startTime,
                        eventData.endTime,
                      )
                    }
                  />
                )}
              />
            </>
          </FormItem>
        </Stack>
        {sessionDate && (
          <Stack direction="row" spacing="20px">
            <Stack spacing="10px" flex={1}>
              <Typography variant="bodyBB">Start Time</Typography>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <DesktopTimePicker
                    {...field}
                    ampm={false}
                    onChange={(newValue: Dayjs | null) => {
                      if (newValue !== null) {
                        field.onChange(getCombinedValue(sessionDate, newValue));
                      }
                    }}
                    shouldDisableTime={shouldDisableTime}
                  />
                )}
              />
            </Stack>
            <Stack spacing="10px" flex={1}>
              <Typography variant="bodyBB">End Time</Typography>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <DesktopTimePicker
                    {...field}
                    ampm={false}
                    onChange={(newValue: Dayjs | null) => {
                      if (newValue !== null) {
                        field.onChange(getCombinedValue(sessionDate, newValue));
                      }
                    }}
                    shouldDisableTime={shouldDisableTime}
                  />
                )}
              />
            </Stack>
          </Stack>
        )}
      </Stack>

      {hasLocation &&
        sessionDate &&
        !dayjs(sessionStartTime).startOf('day').isSame(sessionStartTime) &&
        !dayjs(sessionEndTime).startOf('day').isSame(sessionEndTime) && (
          <Stack spacing="10px">
            <Stack alignItems="center">
              <ArrowDownIcon />
            </Stack>
            <Stack
              spacing="10px"
              padding="10px"
              border="1px solid rgba(255, 255, 255, 0.10)"
              borderRadius="10px"
            >
              <Typography variant="caption">
                Date & times you are booking:
              </Typography>
              <Stack
                borderRadius="10px"
                padding="10px"
                bgcolor="#313131"
                spacing="10px"
              >
                <Typography variant="bodyBB">
                  {dayjs(sessionDate).format('MMMM DD, YYYY')}
                </Typography>
                <Typography variant="bodyS">
                  Start Time: {dayjs(sessionStartTime).format('hh:mm A')}
                </Typography>
                <Typography variant="bodyS">
                  End Time: {dayjs(sessionEndTime).format('hh:mm A')}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
    </>
  );
};

export default SessionDateDisplay;
