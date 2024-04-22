import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';

import { Header, Navbar, Menubar, Sidebar } from 'components/layout';

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
        <div style={{display: 'flex'}}>
          <Sidebar />
          {/* <Navbar /> */}
          {/* <Menubar /> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              flex: 1
            }}
          >
            {children}
          </div>
        </div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
