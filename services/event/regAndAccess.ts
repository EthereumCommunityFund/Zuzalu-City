import { CreateRegAndAccessRequest, UpdateRegAndAccessRequest } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const createRegAndAccess = async (input: CreateRegAndAccessRequest) => {
  return axiosInstance.post('/api/event/admin/regAndAccess/create', input);
};

export const updateRegAndAccess = async (data: any, signal?: AbortSignal) => {
  const response = await fetch('/api/event/admin/regAndAccess/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal, // Pass the AbortSignal to the fetch call
  });

  if (!response.ok) {
    throw new Error('Failed to update registration and access');
  }

  return response.json();
};
