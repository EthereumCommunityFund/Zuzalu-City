import { AddZupassMemberRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const updateZupassMember = async (
  zupassMemberInput: AddZupassMemberRequest,
) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/updateZupassMember',
      zupassMemberInput,
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
