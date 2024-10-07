import { CreateRegAndAccessRequest, UpdateRegAndAccessRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const createRegAndAccess = async (input: CreateRegAndAccessRequest) => {
  return axiosInstance.post('/api/event/admin/regAndAccess/create', input);
};

export const updateRegAndAccess = async (input: UpdateRegAndAccessRequest) => {
  return axiosInstance.post('/api/event/admin/regAndAccess/update', input);
};
