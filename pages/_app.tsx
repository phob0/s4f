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

const TransactionsToastList: any = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/TransactionsToastList"))
      .TransactionsToastList;
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
        environment={EnvironmentsEnum.mainnet}
        customNetworkConfig={{
          name: 'customConfig',
          apiTimeout: process.env.NEXT_PUBLIC_API_TIMEOUT,
          walletConnectV2ProjectId: "1dfc2bc8f9ad07462c9eeef11fd560cf"//process.env.NEXT_PUBLIC_WC_PROJECT_ID
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
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
            <TransactionsToastList
              className = 'transactions-toast-list'
              transactionToastClassName="transactions-toast-class"
              successfulToastLifetime={30000}
            />
            <NotificationModal />
            <SignTransactionsModals/>
            <Component {...pageProps} />
          </Layout>
        </DappProvider>
    </SWRConfig>   
  );  
}

export default App;