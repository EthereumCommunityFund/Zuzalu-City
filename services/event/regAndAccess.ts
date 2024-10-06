import { CreateRegAndAccessRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const createRegAndAccess = async (input: CreateRegAndAccessRequest) => {
  return axiosInstance.post('/api/event/admin/regAndAccess/create', input);
};
