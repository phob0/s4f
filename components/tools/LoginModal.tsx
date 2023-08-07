import {
  Box,
    Button,
    Grid,
    Stack,
    Typography
  } from '@mui/material';
import { useState, memo, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic';
import { walletConnectV2ProjectId } from '../../config/config';
import { useGetIsLoggedIn, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { logout, getAddress } from '@multiversx/sdk-dapp/utils';

const DappModal = dynamic(
  async () => {
    return (
      await import('@multiversx/sdk-dapp/UI/DappModal')
    ).DappModal;
  },
  { ssr: false }
);

const DappModalBody = dynamic(
  async () => {
    return (
      await import('@multiversx/sdk-dapp/UI/DappModal/components/DappModalBody')
    ).DappModalBody;
  },
  { ssr: false }
);

const DappModalHeader = dynamic(
  async () => {
    return (
      await import('@multiversx/sdk-dapp/UI/DappModal/components/DappModalHeader')
    ).DappModalHeader;
  },
  { ssr: false }
);

const ExtensionLoginButton = dynamic(
  async () => {
    return (
      await import('@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton')
    ).ExtensionLoginButton;
  },
  { ssr: false }
);

const WalletConnectLoginButton = dynamic(
  async () => {
    return (
      await import(
        '@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginButton'
      )
    ).WalletConnectLoginButton;
  },
  { ssr: false }
);

const LedgerLoginButton: any = dynamic(
  async () => {
    return (await import('@multiversx/sdk-dapp/UI/ledger/LedgerLoginButton'))
      .LedgerLoginButton;
  },
  { ssr: false }
);

import { WebWalletLoginButtonPropsType } from '@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton';

const WebWalletLoginButton: any = dynamic(
  async () => {
    return (
      await import('@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton')
    ).WebWalletLoginButton;
  },
  { ssr: false }
) as WebWalletLoginButtonPropsType;

import useUser from "../../lib/useUser";

interface LoginModalButtonProps {
  onClose?: () => void;
  onOpen?: () => void;
  showButton?: string;
}

  const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
  
    return {
      isOpen,
      openModal,
      closeModal
    };
  };
  
  type UserSession = {
    isLoggedIn: boolean;
    address: string;
  };
  
  const LoginModalButton = ({
    // onClose,
    // onOpen,
    showButton = ""
  }) => {
    // If you need the auth signature and token pas your unique token in useLogin
    // all auth providers will return the signature, it will be saved in localstorage and global state
    // For the demo purposes here is a dummy token
    const { user, mutateUser } = useUser();

    const loggedIn = useGetIsLoggedIn();
    const logginInfo = useGetLoginInfo();

    console.log("LOGS:", user, loggedIn);
  
    const commonProps = {
        // callbackRoute: routeNames.dashboard,
        nativeAuth: true // optional
      };
  
    let router = useRouter();
  
    const {
      isOpen: opened,
      openModal: open,
      closeModal: close,
    } = useModal();
  
    useEffect(() => {
      if (loggedIn && user?.isLoggedIn == false) {
        upsertAccount();
        close();
      } else if(!loggedIn && user?.isLoggedIn == true) {
        handleLogout();
      }
    });
  
    const upsertAccount = async () => {
      getAddress().then(async (address) => {
        const payload = {
          address: address,
          // signature: logginInfo.tokenLogin?.loginToken,
          expiresAt: new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000).toISOString()
        }
        
        await fetch(`api/login`, {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST'
        })
      })
    }
  
    const handleLogout = () => {
      if (loggedIn && user?.isLoggedIn) {
        logout('/').then(async () => {
          await fetch("/api/logout", { method: "POST" });
          router.push('/');
        });
      }
    };    

    return (
      <>
        {showButton == "" ? (
          loggedIn ? (
            <Button
              // variant="outlined"
              onClick={handleLogout}
              sx={{
                color: 'white',
                // borderColor: 'white',
              }}
              className='dappDisconnectButton'
            >
              Disconnect
            </Button>
          ) : (
            <Button
              // variant="outlined"
              onClick={open}
              sx={{
                color: 'white',
                // borderColor: 'white',
              }}
              className='dappConnectButton'
            >
              Connect
            </Button>
          )
        ) :
          <Typography 
            variant="h6" 
            align="center" 
            color="common.white"
            onClick={open}
            sx={{
              fontWeight: 'bold',
              width: '50%',
            }}
            className='gymStatus'
          >
            {showButton}
          </Typography>
        }
        {!loggedIn &&
        <DappModal
          visible={opened}
          onHide={close}
        >
            <DappModalHeader
              visible={false}
              headerText="Connect Wallet"
            />
            <DappModalBody
            >
              <Stack 
                sx = {{
                  direction: "column",
                  align: "center"
                }}
                >
                 <ExtensionLoginButton
                  className="dappLoginButton"
                  loginButtonText='MultiversX Browser Extension'
                  {...commonProps}
                />
                <WebWalletLoginButton
                  className="dappLoginButton"
                  callbackRoute="/"
                  shouldRenderDefaultCss={false}
                  loginButtonText="Web Wallet"
                  nativeAuth
                />
                <LedgerLoginButton
                  loginButtonText='Ledger'
                  className='dappLoginButton'
                  shouldRenderDefaultCss={false}
                  {...commonProps}
                />
                <WalletConnectLoginButton
                  className="dappLoginButton"
                  loginButtonText='xPortal Mobile App'
                  {...commonProps}
                  {...(walletConnectV2ProjectId
                    ? {
                        isWalletConnectV2: true
                      }
                    : {})
                  }
                  nativeAuth
                />
              </Stack>
            </DappModalBody>
        </DappModal>}
      </>
    );
  };
  
  LoginModalButton.displayName = 'LoginModalButton';
  
  export default LoginModalButton;