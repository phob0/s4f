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
import { FC, useState, useCallback, memo } from 'react';
import { useLogin, useLoginInfo, useLogout, LoginMethodsEnum, useAccount } from '@useelven/core';
import { WalletConnectQRCode } from './WalletConnectQRCode';
import { WalletConnectPairings } from './WalletConnectPairings';
import { useEffectOnlyOnUpdate } from '../../hooks/useEffectOnlyOnUpdate';
import { getLoginMethodDeviceName } from '../../utils/getSigningDeviceName';

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

export const LoginModalButton: FC<LoginModalButtonProps> = memo(({
  onClose,
  onOpen,
}) => {
  // If you need the auth signature and token pas your unique token in useLogin
  // all auth providers will return the signature, it will be saved in localstorage and global state
  // For the demo purposes here is a dummy token
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

  useEffectOnlyOnUpdate(() => {
    if (isLoggedIn) {
      close();
    }
  }, [isLoggedIn]);

  const onCloseComplete = () => {
    setLoggingInState('error', '');
  };

  const upsertAccount = () => {
    console.log(address, expires, signature)
    // fetch(`api/user/upsert`, {
    //   body: JSON.stringify({
    //     address: payload.address,
    //     signature: payload.signature,
    //     expiresAt: payload.expires,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST'
    // }).then(() => {
    //   // refreshData()
    // })
  }

  const [loginMethod, setLoginMethod] = useState<LoginMethodsEnum>();

  const handleLogin = useCallback(
    (type: LoginMethodsEnum, ledgerAccountsIndex?: number) => () => {
      setLoginMethod(type);
      // login(type, ledgerAccountsIndex);
      const promiseThen = new Promise((resolve, reject) => {
        login(type, ledgerAccountsIndex);
    });
    
    promiseThen
        .then((val) => {
            console.log(val);
        })
        .catch((err) => console.log(err));
    },
    [login]
  );

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
        <Button 
          onClick={logout}
        >
          Disconnect
          </Button>
      ) : (
        <Button onClick={open}>
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
                    onClick={handleLogin(LoginMethodsEnum.walletconnect)}
                  >
                    xPortal Mobile App
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
            </Stack>


          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
});
