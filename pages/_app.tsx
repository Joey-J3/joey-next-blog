import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CssBaseline, PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { lightTheme } from '@/styles/theme/light';
import { darkTheme } from '@/styles/theme/theme';
import { ColorContext } from 'context/ColorContext';
import { SearchProvider } from 'context/SearchContext/SearchContext';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';

const TopProgressBar = dynamic(
  () => {
    return import('components/TopProgressBar');
  },
  { ssr: false },
);

const THEME_MODE = 'theme-mode';

const App = ({ Component, pageProps }: AppProps) => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          const mode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem(THEME_MODE, mode);
          return mode;
        });
      },
    }),
    [],
  );

  useEffect(() => {
    setMode((localStorage.getItem(THEME_MODE) as PaletteMode) || 'light');
  }, []);

  const theme = useMemo(() => createTheme(mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <>
      <TopProgressBar />
      <ColorContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <SessionProvider session={pageProps.session}>
            <Head>
              <link rel="stylesheet" type="text/css" href="https://unpkg.com/nprogress@0.2.0/nprogress.css" />
            </Head>
            <div>
              <SearchProvider>
                <Component {...pageProps} />
              </SearchProvider>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </ColorContext.Provider>
    </>
  );
};

export default App;
