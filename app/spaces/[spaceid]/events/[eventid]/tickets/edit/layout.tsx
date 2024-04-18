import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../../../../../theme';

import Header from '../../../../../../../components/Layout/Header';
import Navbar from '../../../../../../../components/Layout/Navbar';
import Menubar from '../../../../../../../components/Layout/Menubar';

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
      <ThemeProvider theme={theme}>
        <Header />
        <Navbar />
        <Menubar />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '30px',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
