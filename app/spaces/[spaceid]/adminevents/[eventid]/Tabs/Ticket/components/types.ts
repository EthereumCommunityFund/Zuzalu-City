import { ReactNode } from 'react';
import * as yup from 'yup';

export interface ItemType {
  id: string;
  name?: string;
  customName?: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  hasWhitelisting?: boolean;
  selectedIcon?: ReactNode;
  expandedContent?: ReactNode;
  options?: OptionType[];
  isExternal?: boolean;
  warning?: string;
}

export interface OptionType {
  id: string;
  name: string;
  warning?: string;
}

export const schema = yup.object().shape({
  access: yup.string(),
  whitelist: yup.string(),
  pass: yup.string(),
  apply: yup.string(),
  options: yup.string(),
});

export type ConfigFormType = yup.InferType<typeof schema>;

export enum RegistrationAccess {
  OpenToAll = 'Open-to-all',
  Whitelist = 'Private Whitelist',
}

export enum TicketingMethod {
  NoTicketing = 'No Ticketing Required',
  ZuPass = 'Zupass',
  ScrollPass = 'Scrollpass',
  LottoPGF = 'LottoPGF',
}

export enum ApplyRule {
  Join = 'Apply to Join',
  NoApplication = 'No Application Required',
  RequireApplication = 'Require Application Form',
  Purchase = 'Apply to Purchase',
}

export enum ApplyOption {
  RequireApprove = 'requireApprove',
  RequireBasicInfo = 'requireBasicInfo',
}

export interface TagProps {
  type: 'text' | 'required' | 'warning' | 'pass';
  pass?: 'zupass' | 'scrollpass';
  text?: string;
  bgColor?: string;
  textColor?: string;
}
