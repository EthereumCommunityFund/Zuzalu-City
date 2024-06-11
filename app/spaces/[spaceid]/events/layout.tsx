import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';

import { Header } from 'components/layout';

export const metadata: Metadata = {
  title: 'Zuzalu City',
  description: 'Zuzalu City Powered By Ethereum Community Fund',
};

function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
