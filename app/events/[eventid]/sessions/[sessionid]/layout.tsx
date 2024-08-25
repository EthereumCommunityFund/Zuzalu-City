import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';

type Props = {
  params: { sessionid: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.sessionid;

  return {
    title: 'Zuzalu City',
    description: 'Zuzalu City Powered By Ethereum Community Fund',
    openGraph: {
      images: [`/api/og?id=${id}`],
    },
  };
}

function SessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <div>{children}</div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default SessionLayout;
