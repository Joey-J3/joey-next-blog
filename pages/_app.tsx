import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Router from 'next/router';
import NProgress from 'nprogress';
import Head from 'next/head';
import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { useMemo, useState } from 'react';
import { lightTheme } from '@/styles/theme/light';
import { darkTheme } from '@/styles/theme/theme';
import { ColorContext } from 'context/ColorContext';
import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'] });

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(mode === 'light' ? lightTheme : darkTheme), [mode]);
  return (
    <ColorContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <SessionProvider session={pageProps.session}>
          <Head>
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/nprogress@0.2.0/nprogress.css" />
          </Head>
          <div className={inter.className}>
            <Component {...pageProps} />
          </div>
        </SessionProvider>
      </ThemeProvider>
    </ColorContext.Provider>
  );
};

export default App;
