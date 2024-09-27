import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const deleteEvent = async (deleteEventInput: {
  eventId: string;
  userDID: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/delete',
      deleteEventInput,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
