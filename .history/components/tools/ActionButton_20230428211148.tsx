import { Box, Button, BoxProps } from '@mui/material';
import { FC, useCallback, PropsWithChildren } from 'react';

interface ActionButtonProps extends BoxProps {
  onClick: () => void;
  isFullWidth?: boolean;
  disabled?: boolean;
}

export const ActionButton: FC<PropsWithChildren<ActionButtonProps>> = ({
  children,
  onClick,
  isFullWidth = false,
  disabled = false
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <Button variant="outlined">
      {children}
    </Button>
  );
};
