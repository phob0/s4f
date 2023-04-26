import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WalletIcon from '@mui/icons-material/Wallet';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import dynamic from "next/dynamic";

const WalletConnectLoginContainer = dynamic(
  async () => {
   return (await import("@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginContainer")).WalletConnectLoginContainer;
  },
  { ssr: false }
);

import WalletConnectProvider from "@multiversx/sdk-wallet-connect-provider";

// const WalletConnectProvider = dynamic(
//   async () => {
//    return (await import("@multiversx/sdk-wallet-connect-provider")).WalletConnectProvider;
//   },
//   { ssr: false }
// );

export function getMaiarLoginSchemaUrl(wcUri: string): string {
  // This can be obtained also from here:
  // https://github.com/ElrondNetwork/dapp-core/blob/7254ac09ce47f337b826a9ac3fc2ecfa01525fc3/src/constants/network.ts#L19
  const walletConnectDeepLink =
    "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/";

  return `${walletConnectDeepLink}?wallet-connect=${wcUri}`;
}

export default function NavBar() {
  const router = useRouter();

  const bridgeUrl = "https://bridge.walletconnect.org";
  
  const onLogin = async () => {
    const callbacks = {
      onClientLogin: async (address, walletConnectProvider) => {
        // This callback is executed once the client successfully logged in.
      },
      onClientLogout: async () => {
        // This callback is executed once the client logged out.
        // Usually here we clean up the previous state.
      },
    };
  
    const walletConnectProvider = new WalletConnectProvider(bridgeUrl, callbacks);
  
    await walletConnectProvider.init();
    // The connectorUri can be represented as a qr code and this is what you
    // usually see what you try to login with Maiar on different web applications.
    const connectorUri = await walletConnectProvider.login();
  
    // The schema url represents the deep linking url needed by the Maiar app
    // in order to let the user log in.
    const schemaUrl = getMaiarLoginSchemaUrl(connectorUri);
  
    fetch(schemaUrl, {
      method: 'GET'
    }).then((r) => {
      console.log(r)
    })

    // This opens the Maiar app using the given schema url.
    // Linking.canOpenURL(schemaUrl)
    //   .then((supported) => {
    //     if (supported) {
    //       return Linking.openURL(schemaUrl);
    //     } else {
    //       console.log("An error occurred processing the Schema Url");
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {
              router.route !== "/" ? (
                <IconButton sx={{ 
                  color: 'white', 
                  backgroundColor: '#ab47bc',
                  "&:hover": { 
                    color: "#ab47bc",
                    backgroundColor: "white" 
                  } 
                }} onClick={() => router.back()}>
                  <ArrowBackIcon />
                </IconButton>    
              ) : ( null )
            }
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Box
                component="img"
                sx={{ 
                  height: 40,
                  margin: 3 
                }}
                src="/s4f-classic.png"
              />
            </Link>  
          </Typography>
          <Button sx={{ color: "white" }} endIcon={<WalletIcon />}>
            Connect to your wallet
          </Button>
        </Toolbar>
      </AppBar>
      
    </Box>
  )
}