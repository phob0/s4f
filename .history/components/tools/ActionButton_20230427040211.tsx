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
        ...(disabled ? { cursor : 'not-allowed' } : { cursor : 'pointer' }),
        ...(disabled ? { '&hover' : { backgroundColor: 'gray' } } : {  })
      }}
      color="white"
      // _hover={!disabled ? { bg: 'dappTemplate.color2.darker' } : {}}
      // transition="background-color .3s"
      // width={isFullWidth ? '100%' : 'auto'}
      // onClick={handleClick}
      // opacity={!disabled ? 1 : 0.5}
      {...props}
    >
      {children}
    </Box>
  );
};
