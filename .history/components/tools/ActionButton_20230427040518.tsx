import { Box, BoxProps } from '@mui/material';
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
        borderColor: "#000",
        borderWidth: 2,
        backgroundColor: "transparent",
        py: 2,
        px: 6,
        fontWeight: "normal",
        userSelect: "none",
        transition: "background-color .3s",
        ...(disabled ? { cursor : 'not-allowed' } : { cursor : 'pointer' }),
        ...(disabled ? { '&hover' : { backgroundColor: 'gray' } } : {  }),
        ...(isFullWidth ? { width : '100%' } : { width : 'auto' })
      }}
      color="white"
      // width={isFullWidth ? '100%' : 'auto'}
      // onClick={handleClick}
      // opacity={!disabled ? 1 : 0.5}
      {...props}
    >
      {children}
    </Box>
  );
};
