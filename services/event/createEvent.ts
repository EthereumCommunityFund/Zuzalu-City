import { CreateEventRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const createEventKeySupa = async (eventInput: CreateEventRequest) => {
  return axiosInstance.post('/api/event/create', eventInput);
};
