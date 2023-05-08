import '@/styles/globals.css'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'
import { SWRConfig } from "swr";
import fetchJson from "../lib/fetchJson";
import { useNetworkSync } from '@useelven/core';

const App = ({ Component, pageProps }: AppProps) => {
  useNetworkSync({
    chainType: process.env.NEXT_PUBLIC_MULTIVERSX_CHAIN,
    ...(process.env.NEXT_PUBLIC_MULTIVERSX_API
      ? { apiAddress: process.env.NEXT_PUBLIC_MULTIVERSX_API }
      : {}),
    ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
      ? { walletConnectV2ProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }
      : {}),
  });
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Layout>
          <style global jsx>{`
            html,
            body,
            body > div:first-child,
            div#__next,
            div#__next > div {
              min-height: 100vh;
            }
          `}</style>
          <Component {...pageProps} />
        </Layout>
    </SWRConfig>   
  );  
}

export default App;