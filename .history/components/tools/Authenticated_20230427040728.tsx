import { FC, ReactElement, PropsWithChildren } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useLoggingIn } from '@useelven/core';

interface AuthenticatedProps {
  fallback?: ReactElement;
  noSpinner?: boolean;
  spinnerCentered?: boolean;
}

export const Authenticated: FC<PropsWithChildren<AuthenticatedProps>> = ({
  children,
  fallback = null,
  noSpinner = false,
  spinnerCentered = false,
}) => {
  const { pending, loggedIn } = useLoggingIn();

  if (pending)
    return noSpinner ? null : (
      <Box justify={spinnerCentered ? 'center' : 'flex-start'}>
        <CircularProgress
          thickness="3px"
          speed="0.4s"
          color="elvenTools.color2.base"
          size="md"
          mt={3}
        />
      </Box>
    );

  if (!loggedIn) return fallback;

  return <>{children}</>;
};
