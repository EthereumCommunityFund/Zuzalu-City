import * as React from 'react';
import { IconProps } from 'types';

export const EthereumIcon: React.FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37259 18.6274 0 12 0C5.37259 0 0 5.37259 0 12C0 18.6274 5.37259 24 12 24Z" fill="#25292E" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37259 18.6274 0 12 0C5.37259 0 0 5.37259 0 12C0 18.6274 5.37259 24 12 24Z" fill="url(#paint0_linear_4877_28374)" fillOpacity="0.3" />
      <path d="M7.02002 12.6606L12 15.6069L16.9791 12.6606L12 19.6792L7.02002 12.6606Z" fill="url(#paint1_linear_4877_28374)" />
      <path d="M12 14.5098L7.02002 11.5635L12 3.72021L16.98 11.5635L12 14.5098Z" fill="white" />
      <defs>
        <linearGradient id="paint0_linear_4877_28374" x1="0" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear_4877_28374" x1="11.9995" y1="12.6606" x2="11.9995" y2="19.6792" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
