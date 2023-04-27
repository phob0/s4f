import { Box, BoxProps } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';

const FlexWrapper = <Box 
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
/>;

export const FlexCardWrapper: FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  return <FlexWrapper {...props}>{children}</FlexWrapper>;
};

const Wrapper = createTheme(Box, {
  baseStyle: {
    backgroundColor: 'dappTemplate.dark.darker',
    padding: 8,
    borderRadius: '2xl',
  },
});

export const CardWrapper: FC<PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  return <Wrapper {...props}>{children}</Wrapper>;
};
