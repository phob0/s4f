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
      <Box 
        sx = {{
          ...(spinnerCentered ? { justify: 'center' } : { justify: 'flex-start' })
        }}
        >
        <CircularProgress
          sx = {{
            mt: 3
          }}
        />
      </Box>
    );

  if (!loggedIn) return fallback;

  return <>{children}</>;
};
