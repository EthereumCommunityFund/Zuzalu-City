import { ReactNode } from 'react';
import * as yup from 'yup';

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
  options?: OptionType[];
}

export interface OptionType {
  id: string;
  name: string;
}

export const schema = yup.object().shape({
  access: yup.string(),
  whitelist: yup.string(),
  pass: yup.string(),
  apply: yup.string(),
  options: yup.string(),
});

export type ConfigFormType = yup.InferType<typeof schema>;