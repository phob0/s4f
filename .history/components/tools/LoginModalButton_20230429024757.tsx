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
import { useLogin, useLoginInfo, useLogout, LoginMethodsEnum } from '@useelven/core';
import { LoginComponent } from '../tools/LoginComponent';
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
  
  const { isLoggedIn, isLoggingIn, setLoggingInState } = useLogin();
  const { loginMethod } = useLoginInfo();
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

  const ledgerOrPortalName = getLoginMethodDeviceName(loginMethod);

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
            {isLoggingIn && (
                <Stack alignItems="center">
                  {ledgerOrPortalName ? (
                    <>
                      <Typography fontSize="lg">Confirmation required</Typography>
                      <Typography fontSize="sm">Approve on {ledgerOrPortalName}</Typography>
                    </>
                  ) : null}
                  <CircularProgress />
                </Stack>
            )}

            <LoginComponent />

          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
});
