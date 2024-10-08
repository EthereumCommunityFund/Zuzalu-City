import React from 'react';
import { IconProps } from 'types';

export const ArrowUpLeftIcon: React.FC<IconProps> = ({ size = 6 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={`${size * 4}px`}
      height={`${size * 4}px`}
    >
      <path
        fillRule="evenodd"
        d="M5.25 6.31v9.44a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75h11.25a.75.75 0 0 1 0 1.5H6.31l13.72 13.72a.75.75 0 1 1-1.06 1.06L5.25 6.31Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
