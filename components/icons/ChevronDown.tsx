import React from 'react';
import { IconProps } from 'types';

export const ChevronDownIcon: React.FC<
  IconProps & { style?: React.CSSProperties }
> = ({ size = 6, style }) => {
  return (
    <div style={{ width: size * 4, height: size * 4, ...style }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        width={`${size * 4}px`}
        height={`${size * 4}px`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
};
