import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material';
import { useNetworkSync } from '@useelven/core';
import { theme } from '../config/muiTheme';

const NextJSDappTemplate = ({ Component, pageProps }: AppProps) => {
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
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default NextJSDappTemplate;
