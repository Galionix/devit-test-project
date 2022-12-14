import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { useState, useEffect } from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
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
          <Component {...pageProps} />
        </ApolloProvider>
      </main>
    </>
  );
}

export default CustomApp;
