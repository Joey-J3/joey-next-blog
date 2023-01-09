import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css'
import Router from 'next/router';
import NProgress from 'nprogress'
import Head from 'next/head';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())


const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/nprogress@0.2.0/nprogress.css" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;