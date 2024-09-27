import { ReactNode } from 'react';

export interface ItemType {
  id: string;
  name?: string;
  customName?: ReactNode;
  description: string;
  icon?: ReactNode;
  disabled?: boolean;
  hasWhitelisting?: boolean;
  selectedIcon?: ReactNode;
  expandedContent?: ReactNode;
}
