import { Box, BoxProps } from '@mui/material';
import { createTheme, ThemeProvider } from '@material-ui/styles';
import { FC, PropsWithChildren } from 'react';

const FlexWrapper = createTheme(Box, {
  baseStyle: {
    backgroundColor: 'dappTemplate.dark.darker',
    padding: 8,
    borderRadius: '2xl',
    textAlign: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
