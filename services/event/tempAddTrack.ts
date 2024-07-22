import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const tempUpdateTrack = async (addTrackInput: {
  eventId: string;
  newTrack: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/tempUpdateInfo',
      addTrackInput,
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
