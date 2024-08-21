import dayjs, { Dayjs } from '@/utils/dayjs';
import { Venue, Event, Session } from '@/types';
import { useCallback, useState } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

interface IUseSessionTime {
  venues: Venue[];
  eventData: Event;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  bookedSessionsForDay: Session[];
  setBookedSessionsForDay: (session: Session[]) => void;
}

const useSessionTime = ({
  venues,
  eventData,
  control,
  setValue,
  bookedSessionsForDay,
  setBookedSessionsForDay,
}: IUseSessionTime) => {
  const isPerson = useWatch({ control, name: 'isPerson' });
  const sessionLocation = useWatch({ control, name: 'location' });
  const sessionDate = useWatch({ control, name: 'date' });
  const sessionStartTime = useWatch({ control, name: 'startTime' });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  const { data: bookedSessions } = useQuery({
    queryKey: ['getBookedSession', sessionLocation],
    queryFn: () =>
      supabase.from('sessions').select('*').eq('location', sessionLocation),
    select: (data: any) => {
      if (data.data !== null) {
        return data.data;
      }
      return null;
    },
  });

  const handleDateChange = useCallback(
    async (date: Dayjs) => {
      if (date && isPerson && sessionLocation !== 'Custom') {
        const dayName = date.format('dddd'); // Get the day name (e.g., 'Monday')
        const selectedDay = date.format('YYYY-MM-DD');
        if (sessionLocation == '') {
          return;
        }
        const available = JSON.parse(
          venues.filter((item) => item.name === sessionLocation)[0].bookings,
        );
        setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
        if (bookedSessions) {
          const bookedSessionsDay = bookedSessions.filter((session: any) => {
            const sessionStartDay = dayjs(session.startTime).format(
              'YYYY-MM-DD',
            );
            return sessionStartDay === selectedDay;
          });
          setBookedSessionsForDay(bookedSessionsDay);
        }
      }
      const initTime = dayjs().tz(eventData?.timezone).startOf('day');
      setValue('date', date);
      setValue('startTime', initTime);
      setValue('endTime', initTime);
    },
    [
      bookedSessions,
      eventData.timezone,
      isPerson,
      sessionLocation,
      setBookedSessionsForDay,
      setValue,
      venues,
    ],
  );

  const isDateInRange = useCallback(
    (date: Dayjs, startDate?: string, endDate?: string): boolean => {
      return (
        date.isAfter(dayjs(startDate).subtract(1, 'day')) &&
        date.isBefore(dayjs(endDate).add(1, 'day'))
      );
    },
    [],
  );

  const isTimeAvailable = useCallback(
    (date: Dayjs, isStart: boolean): boolean => {
      let timezone = eventData?.timezone;
      if (sessionDate == null) return true;
      const formattedTime = date.format('HH:mm');
      const isNotWithinBookedSession = bookedSessionsForDay.every((session) => {
        const sessionStartTime = dayjs(session.startTime)
          .tz('UTC')
          .tz(timezone)
          .format('HH:mm');
        const sessionEndTime = dayjs(session.endTime)
          .tz('UTC')
          .tz(timezone)
          .format('HH:mm');

        if (isStart) {
          return (
            formattedTime < sessionStartTime || formattedTime >= sessionEndTime
          );
        } else {
          return (
            formattedTime <= sessionStartTime || formattedTime > sessionEndTime
          );
        }
      });
      const isWithinAvailableSlot = availableTimeSlots.some((slot: any) => {
        let startTime;
        let endTime;
        if (isStart) {
          const startTime = dayjs
            .tz(slot.startTime, 'HH:mm', 'UTC')
            .tz(timezone)
            .format('HH:mm');
          const endTime = dayjs
            .tz(slot.endTime, 'HH:mm', 'UTC')
            .tz(timezone)
            .format('HH:mm');
          if (endTime >= startTime) {
            return formattedTime >= startTime && formattedTime < endTime;
          } else {
            return !(formattedTime < startTime && formattedTime >= endTime);
          }
        } else {
          startTime = sessionStartTime.tz(timezone).format('HH:mm');
          endTime = dayjs
            .tz(slot.endTime, 'HH:mm', 'UTC')
            .tz(timezone)
            .format('HH:mm');
          if (endTime >= startTime) {
            return formattedTime >= startTime && formattedTime <= endTime;
          } else {
            return !(formattedTime < startTime && formattedTime > endTime);
          }
        }
      });
      return isWithinAvailableSlot && isNotWithinBookedSession;
    },
    [
      availableTimeSlots,
      bookedSessionsForDay,
      eventData.timezone,
      sessionDate,
      sessionStartTime,
    ],
  );

  const isSessionOverlap = useCallback(
    (bookedSessions: Session[], startTime: Dayjs, endTime: Dayjs) => {
      const newSessionStart = startTime;
      const newSessionEnd = endTime;
      let timezone = eventData?.timezone;
      for (let session of bookedSessions) {
        const sessionStart = dayjs(session.startTime).tz('UTC').tz(timezone);
        const sessionEnd = dayjs(session.endTime).tz('UTC').tz(timezone);
        if (
          (newSessionStart.isBefore(sessionEnd) &&
            newSessionStart.isAfter(sessionStart)) ||
          (newSessionEnd.isAfter(sessionStart) &&
            newSessionEnd.isBefore(sessionEnd)) ||
          (newSessionStart.isBefore(sessionStart) &&
            newSessionEnd.isAfter(sessionEnd))
        ) {
          return true;
        }
      }
      return false;
    },
    [],
  );

  return { handleDateChange, isDateInRange, isTimeAvailable, isSessionOverlap };
};

export default useSessionTime;
