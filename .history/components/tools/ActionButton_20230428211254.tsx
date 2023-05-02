import { Box, Button, ButtonProps } from '@mui/material';
import { FC, useCallback, PropsWithChildren } from 'react';

interface ActionButtonProps extends ButtonProps {
  onClick: () => void;
  isFullWidth?: boolean;
  disabled?: boolean;
}

export const ActionButton: FC<PropsWithChildren<ActionButtonProps>> = ({
  children,
  onClick,
  isFullWidth = false,
  disabled = false,
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <Button variant="outlined" {...props}>
      {children}
    </Button>
  );
};
