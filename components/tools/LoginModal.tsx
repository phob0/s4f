import {
    Dialog,
    DialogContent,
    Typography,
    DialogActions,
    Button,
    CircularProgress,
    DialogTitle,
    Stack,
    Box
  } from '@mui/material';
  import { FC, useState, useCallback, memo, useEffect } from 'react';
  import { useLogin, useLoginInfo, useLogout, LoginMethodsEnum, useAccount } from '@useelven/core';
  import { WalletConnectQRCode } from './WalletConnectQRCode';
  import { WalletConnectPairings } from './WalletConnectPairings';
  import { useEffectOnlyOnUpdate } from '../../hooks/useEffectOnlyOnUpdate';
  import { getLoginMethodDeviceName } from '../../utils/getSigningDeviceName';
  import { useRouter } from 'next/router'
  import { LedgerAccountsList } from './LedgerAccountsList';
  import dynamic from 'next/dynamic';
  import { walletConnectV2ProjectId } from '../../config/config';
  import { useGetIsLoggedIn, useGetLoginInfo, useGetAccount } from '@multiversx/sdk-dapp/hooks';
  import { logout, getAccount, getAddress, refreshAccount } from '@multiversx/sdk-dapp/utils';

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
  
  const LedgerLoginButton = dynamic(
    async () => {
      return (await import('@multiversx/sdk-dapp/UI/ledger/LedgerLoginButton'))
        .LedgerLoginButton;
    },
    { ssr: false }
  );
  
  const WebWalletLoginButton = dynamic(
    async () => {
      return (
        await import('@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton')
      ).WebWalletLoginButton;
    },
    { ssr: false }
  );
  
  import useUser from "../../lib/useUser";
  
  interface LoginModalButtonProps {
    onClose?: () => void;
    onOpen?: () => void;
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
  
  const LoginModalButton = memo(({
    // onClose,
    // onOpen
  }) => {
    // If you need the auth signature and token pas your unique token in useLogin
    // all auth providers will return the signature, it will be saved in localstorage and global state
    // For the demo purposes here is a dummy token
    const { user, mutateUser } = useUser();

    const loggedIn = useGetIsLoggedIn();
    const logginInfo = useGetLoginInfo();

    console.log('info')

    const commonProps = {
        // callbackRoute: routeNames.dashboard,
        nativeAuth: true // optional
      };
  
    let router= useRouter();
  
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
    }, [loggedIn]);
  
    const upsertAccount = async () => {
      getAddress().then(async (address) => {
        const payload = {
          address: address,
          signature: logginInfo.tokenLogin?.loginToken,
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
  
    const [loginMethod, setLoginMethod] = useState<LoginMethodsEnum>();
  
    const handleLogout = () => {
      logout('/').then(async () => {
        await fetch("/api/logout", { method: "POST" })
        router.push('/')
      });
    };
  
    const handleLedgerAccountsList = useCallback(() => {
      setLoginMethod(LoginMethodsEnum.ledger);
    }, []);
  
    const resetLoginMethod = useCallback(() => {
      setLoginMethod(undefined);
    }, []);

    return (
      <>
        {loggedIn ? (
          <Button onClick={handleLogout}
            sx={{ 
              color: 'white',
              borderColor: 'white'
            }}
          >
            Disconnect
            </Button>
        ) : (
          <Button variant="outlined" onClick={open} sx={{ 
            color: 'white',
            borderColor: 'white'
          }}>
            Connect
          </Button>
        )}
        <DappModal
          visible={opened}
          onHide={close}
          // onCloseComplete={onCloseComplete}
        >
            <DappModalHeader
              headerText="Connect your wallet"
            />
            <DappModalBody>
  
              <Stack 
                spacing={2}
                sx = {{
                  direction: "column",
                  align: "center"
                }}
                >
                 <ExtensionLoginButton
                  loginButtonText='Extension'
                  {...commonProps}
                />

                <WebWalletLoginButton
                  loginButtonText='Web wallet'
                  {...commonProps}
                />
                <LedgerLoginButton
                  loginButtonText='Ledger'
                  className='test-class_name'
                  {...commonProps}
                />
                <WalletConnectLoginButton
                  loginButtonText='Maiar'
                  {...commonProps}
                  {...(walletConnectV2ProjectId
                    ? {
                        isWalletConnectV2: true
                      }
                    : {})}
                />
              </Stack>
  
            </DappModalBody>
        </DappModal>
      </>
    );
  });
  
  LoginModalButton.displayName = 'LoginModalButton';
  
  export default LoginModalButton;