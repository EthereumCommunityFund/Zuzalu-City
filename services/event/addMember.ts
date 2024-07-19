import { AddMemberRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const updateMember = async (addMemberInput: AddMemberRequest) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/updateMember',
      addMemberInput,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
