import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';


function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Welcome to frontend!</title>
      </Head>
      <main className="app">
        <ApolloProvider client={client}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ApolloProvider>
      </main>
    </>
  );
}

export default CustomApp;
