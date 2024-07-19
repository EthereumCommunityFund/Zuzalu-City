import * as React from 'react';
import { IconProps } from 'types';

export const LeftArrowIcon: React.FC<IconProps> = ({ size = 6 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={`${size * 4}px`}
      height={`${size * 4}px`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
      />
    </svg>
  );
};
