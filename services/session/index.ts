import { SessionSupabaseData } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const supaCreateSession = async (sessionInput: SessionSupabaseData) => {
  return await axiosInstance.post('/api/session/create', sessionInput);
};
