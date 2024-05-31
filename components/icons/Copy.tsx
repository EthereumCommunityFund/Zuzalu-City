import * as React from 'react';
import { IconProps } from 'types';

export const CopyIcon: React.FC<IconProps> = ({
  cursor = "pointer"
}) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={cursor}>
      <g opacity="0.5">
        <path d="M12.375 6.1875V4.5C12.375 3.56802 11.6195 2.8125 10.6875 2.8125H4.5C3.56802 2.8125 2.8125 3.56802 2.8125 4.5V10.6875C2.8125 11.6195 3.56802 12.375 4.5 12.375H6.1875M12.375 6.1875H13.5C14.432 6.1875 15.1875 6.94302 15.1875 7.875V13.5C15.1875 14.432 14.432 15.1875 13.5 15.1875H7.875C6.94302 15.1875 6.1875 14.432 6.1875 13.5V12.375M12.375 6.1875H7.875C6.94302 6.1875 6.1875 6.94302 6.1875 7.875V12.375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};
