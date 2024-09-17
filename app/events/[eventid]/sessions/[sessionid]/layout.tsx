import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';

type Props = {
  params: { sessionid: string; eventid: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.sessionid;
  const eventId = params.eventid;

  return {
    title: 'Zuzalu City',
    description: 'Zuzalu City Powered By Ethereum Community Fund',
    openGraph: {
      images: [`/api/og?id=${id}&eventId=${eventId}&type=session`],
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
