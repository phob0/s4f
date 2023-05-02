import {
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  DialogTitle,
  Stack
} from '@mui/material';
import { FC, useState } from 'react';
import { useLogin, useLoginInfo, useLogout } from '@useelven/core';
import { ActionButton } from '../tools/ActionButton';
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

export const LoginModalButton: FC<LoginModalButtonProps> = ({
  onClose,
  onOpen,
}) => {
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
        <ActionButton onClick={logout}>Disconnect</ActionButton>
      ) : (
        <ActionButton onClick={open}>
          {isLoggingIn ? 'Connecting...' : 'Connect123'}
        </ActionButton>
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
              <Box
                // sx = {{
                //   backgroundColor: "gray",
                //   alignItems: "center",
                //   justifyContent: "center",
                //   pb: 10,
                //   position: "absolute",
                //   zIndex: "overlay",
                //   inset: 0
                // }}
              >
                <Stack alignItems="center">
                  {ledgerOrPortalName ? (
                    <>
                      <Typography fontSize="lg">Confirmation required</Typography>
                      <Typography fontSize="sm">Approve on {ledgerOrPortalName}</Typography>
                    </>
                  ) : null}
                  <CircularProgress />
                </Stack>
              </Box>
            )}
            <LoginComponent />
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
