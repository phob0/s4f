import { Box, BoxProps } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';


export const FlexCardWrapper: FC<PropsWithChildren> = ({
  children
}) => {
  return <Box 
    sx={{
      backgroundColor: 'gray',
      padding: 8,
      borderRadius: '2xl',
      textAlign: 'center',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >{children}</Box>;
};

export const CardWrapper: FC<PropsWithChildren<BoxProps>> = ({
  children
}) => {
  return <Box 
    sx={{
      backgroundColor: 'gray',
      padding: 8,
      borderRadius: '2xl',
    }}
  >{children}</Box>;
};
