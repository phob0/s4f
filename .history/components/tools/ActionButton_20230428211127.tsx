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
  disabled = false,
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <Box
      sx = {{
        borderWidth: 2,
        py: 2,
        px: 6,
        fontWeight: "normal",
        userSelect: "none",
        transition: "background-color .3s",
        ...(disabled ? { cursor : 'not-allowed' } : { cursor : 'pointer' }),
        ...(disabled ? { '&hover' : { backgroundColor: 'gray' } } : {  }),
        ...(isFullWidth ? { width : '100%' } : { width : 'auto' }),
        ...(disabled ? { opacity : 1 } : { opacity : 0.5 })
      }}
      color="white"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Box>
    <Button variant="outlined">
      
    </Button>
  );
};
