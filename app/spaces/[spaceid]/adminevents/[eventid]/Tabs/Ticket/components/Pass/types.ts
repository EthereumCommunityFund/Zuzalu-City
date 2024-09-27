import { ReactNode } from 'react';

export interface RegistrationMethod {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  disabled?: boolean;
  hasWhitelisting?: boolean;
  selectedIcon?: ReactNode;
}