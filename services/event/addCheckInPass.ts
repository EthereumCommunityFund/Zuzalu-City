import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const addCheckInPass = async (addCheckInPassInput: {
  eventId: string;
  checkinPass: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/addCheckInPass',
      addCheckInPassInput,
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
