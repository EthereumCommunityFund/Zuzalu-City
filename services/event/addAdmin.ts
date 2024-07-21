import { AddAdminRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export const updateAdmin = async (addAdminInput: AddAdminRequest) => {
  try {
    const response = await axiosInstance.post(
      '/api/event/updateAdmin',
      addAdminInput,
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
