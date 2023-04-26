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


export default function NavBar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
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
          <Button sx={{ color: "white" }} onClick={walletConnectInit} endIcon={<WalletIcon />}>
            Connect to your wallet
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Email Validation</DialogTitle>
        <DialogContent>
        <WalletConnectLoginContainer
          callbackRoute={'/'}
          loginButtonText='Login with xPortal'
          title='xPortal Login'
          logoutRoute='/unlock'
          className='wallect-connect-login-modal'
          lead='Scan the QR code using xPortal'
          wrapContentInsideModal={true}
          token={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODIyMDYxMzMsImV4cCI6MTY4MjIwOTczMywiaXNzIjoieHBvcnRhbC5kZXYiLCJzdWIiOiJzaGFyZWJhYW5kYUBnbWFpbC5jb20ifQ.C7GbDqWq_1cOTzSbtA9xXmUokenJsnaa0fQLnytYhz8'}
          isWalletConnectV2={true} // or simply isWalletConnectV2
        />
        </DialogContent>
      </Dialog>
    </Box>
  )
}