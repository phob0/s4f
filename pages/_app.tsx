import '../styles/globals.css'
import '../styles/carousel.css';
import Layout from '../components/layout'
import type { AppProps } from 'next/app'
import { SWRConfig } from "swr";
import fetchJson from "../lib/fetchJson";
import dynamic from 'next/dynamic';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider';


const SignTransactionsModals = dynamic(
  async () => {
    return (await import('@multiversx/sdk-dapp/UI/SignTransactionsModals'))
      .SignTransactionsModals;
  },
  { ssr: false }
);

const NotificationModal = dynamic(
  async () => {
    return (await import('@multiversx/sdk-dapp/UI/NotificationModal'))
      .NotificationModal;
  },
  { ssr: false }
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <DappProvider
        environment={EnvironmentsEnum.devnet}
        customNetworkConfig={{
          name: 'customConfig',
          apiTimeout: process.env.NEXT_PUBLIC_API_TIMEOUT,
          walletConnectV2ProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID
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
            <NotificationModal />
            <SignTransactionsModals className='custom-class-for-modals' />
            <Component {...pageProps} />
          </Layout>
        </DappProvider>
    </SWRConfig>   
  );  
}

export default App;