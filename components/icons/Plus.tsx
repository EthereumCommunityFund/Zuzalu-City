import React from 'react';

type PlusIconType = {
  color?: string,
  size?: number
}

export const PlusIcon: React.FC<PlusIconType> = ({size = 6}) => {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
