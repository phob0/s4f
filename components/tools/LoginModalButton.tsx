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

  let router= useRouter();

  const {
    login,
    isLoggedIn,
    isLoggingIn,
    error,
    walletConnectUri,
    getHWAccounts,
    walletConnectPairingLogin,
    walletConnectPairings,
    walletConnectRemovePairing,
    setLoggingInState,
  } = useLogin({ token: process.env.NEXT_PUBLIC_LOGIN_TOKEN });

  const { address } = useAccount();
  const { expires, signature } = useLoginInfo();

  const { logout } = useLogout();
  const {
    isOpen: opened,
    openModal: open,
    closeModal: close,
  } = useModal();

  useEffect(() => {
    if (isLoggedIn && user?.isLoggedIn == false) {
      upsertAccount();
      close();
    } else if(!isLoggedIn && user?.isLoggedIn == true) {
      handleLogout();
    }
  }, [isLoggedIn]);

  const onCloseComplete = () => {
    setLoggingInState('error', '');
  };

  const upsertAccount = async () => {

    const payload = {
      address: address,
      signature: signature,
      expiresAt: new Date(expires).toISOString()
    }
    
    await fetch(`api/login`, {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    })
  }

  const [loginMethod, setLoginMethod] = useState<LoginMethodsEnum>();

  const handleLogin = useCallback(
    (type: LoginMethodsEnum, ledgerAccountsIndex?: number) => () => {
      console.log(type)
      setLoginMethod(type);
      login(type, ledgerAccountsIndex).then(()=>{
        
      })
    },
    [login]
  );

  const handleLogout = () => {
    logout().then(async () => {
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

  const backToOptions = useCallback(() => {
    setLoggingInState('error', '');
  }, [setLoggingInState]);

  return (
    <>
      {isLoggedIn ? (
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
          {isLoggingIn ? 'Connecting...' : 'Connect'}
        </Button>
      )}
      <Dialog
        open={opened}
        onClose={close}
        // onCloseComplete={onCloseComplete}
      >
        <DialogContent>
          <Button />
          <DialogTitle>
            <Typography textAlign="center" fontWeight="black" fontSize="2xl">
              Connect your wallet
            </Typography>
          </DialogTitle>
          <DialogActions>
              

            <Stack 
              spacing={2}
              sx = {{
                direction: "column",
                align: "center"
              }}
              >
               {loginMethod === LoginMethodsEnum.walletconnect && walletConnectUri && (
                <Box mt={5}>
                  <WalletConnectQRCode uri={walletConnectUri} />
                </Box>
              )} 
              {!isLoggedIn && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleLogin(LoginMethodsEnum.wallet)}
                  >
                    MultiversX Web Wallet
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleLogin(LoginMethodsEnum.extension)}
                  >
                    MultiversX Browser Extension
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleLogin(LoginMethodsEnum.walletconnect)}
                  >
                    xPortal Mobile App
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleLedgerAccountsList}
                  >
                    Ledger
                  </Button>
                </>
              )}
              {loginMethod === LoginMethodsEnum.walletconnect &&
                walletConnectPairings &&
                walletConnectPairings.length > 0 && (
                  <WalletConnectPairings
                    pairings={walletConnectPairings}
                    login={walletConnectPairingLogin}
                    remove={walletConnectRemovePairing}
                  />
                )}
                {loginMethod === LoginMethodsEnum.ledger && (
                  <LedgerAccountsList
                    getHWAccounts={getHWAccounts}
                    resetLoginMethod={resetLoginMethod}
                    handleLogin={handleLogin}
                  />
                )}
            </Stack>


          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
});

LoginModalButton.displayName = 'LoginModalButton';

export default LoginModalButton;