import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const updateContractID = async (addContractIDInput: {
  eventId: string;
  contractID: number;
}) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/addContractID',
      addContractIDInput,
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
