import { UpdateEventRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const updateEventKeySupa = async (eventInput: UpdateEventRequest) => {
  return await axiosInstance.post('/api/event/update', eventInput);
};

export const updateCheckinPass = async (
  eventId: string,
  checkinPass: string,
) => {
  return await axiosInstance.post('/api/event/updateCheckinPass', {
    eventId,
    checkinPass,
  });
};
