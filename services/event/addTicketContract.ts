import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const updateTicketContract = async (addTicketContractInput: {
  eventId: string;
  type: string;
  contractAddress: string;
  description: string;
  image_url: string;
  status: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/addTicketContract',
      addTicketContractInput,
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
