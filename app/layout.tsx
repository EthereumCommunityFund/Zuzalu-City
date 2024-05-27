'use client';
// import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';
//import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { CeramicWrapper } from '@/context/CeramicContext';
import React, { ReactNode } from 'react';
const queryClient = new QueryClient();

// export const metadata: Metadata = {
//   title: 'Zuzalu City',
//   description: 'Zuzalu City Powered By Ethereum Community Fund',
// };
interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <CeramicWrapper>{children}</CeramicWrapper>
            </QueryClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
