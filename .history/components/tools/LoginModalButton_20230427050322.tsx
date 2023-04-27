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
import { FC } from 'react';
import { useLogin, useLoginInfo, useLogout } from '@useelven/core';
import { ActionButton } from '../tools/ActionButton';
import { LoginComponent } from '../tools/LoginComponent';
import { useEffectOnlyOnUpdate } from '../../hooks/useEffectOnlyOnUpdate';
import { getLoginMethodDeviceName } from '../../utils/getSigningDeviceName';

interface LoginModalButtonProps {
  onClose?: () => void;
  onOpen?: () => void;
}

export const LoginModalButton: FC<LoginModalButtonProps> = ({
  onClose,
  onOpen,
}) => {
  const { isLoggedIn, isLoggingIn, setLoggingInState } = useLogin();
  const { loginMethod } = useLoginInfo();
  const { logout } = useLogout();
  const {
    isOpen: opened,
    onOpen: open,
    onClose: close,
   };// = useModal({ onClose, onOpen });

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
          {isLoggingIn ? 'Connecting...' : 'Connect'}
        </ActionButton>
      )}
      <Dialog
        isOpen={opened}
        size="sm"
        onClose={close}
        isCentered
        scrollBehavior="inside"
        onCloseComplete={onCloseComplete}
      >
        <DialogContent
          bgColor="dappTemplate.dark.darker"
          px={6}
          pt={7}
          pb={10}
          position="relative"
        >
          <Button _focus={{ outline: 'none' }} />
          <DialogTitle>
            <Typography textAlign="center" fontWeight="black" fontSize="2xl">
              Connect your wallet
            </Typography>
          </DialogTitle>
          <DialogActions>
            {isLoggingIn && (
              <Box
                alignItems="center"
                backdropFilter="blur(3px)"
                bgColor="blackAlpha.700"
                justifyContent="center"
                position="absolute"
                zIndex="overlay"
                inset={0}
              >
                <Stack alignItems="center">
                  {ledgerOrPortalName ? (
                    <>
                      <Typography fontSize="lg">Confirmation required</Typography>
                      <Typography fontSize="sm">Approve on {ledgerOrPortalName}</Typography>
                    </>
                  ) : null}
                  <CircularProgress
                    thickness="3px"
                    speed="0.4s"
                    color="dappTemplate.color2.base"
                    size="xl"
                  />
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
