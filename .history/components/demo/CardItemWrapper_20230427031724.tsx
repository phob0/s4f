import { FC, PropsWithChildren } from 'react';
import { Flex, forwardRef, FlexProps } from '@mui/material';

export const CardItemWrapper: FC<PropsWithChildren> = forwardRef<
  FlexProps,
  'div'
>(({ children }, ref) => (
  <Flex flexWrap="wrap" gap={2} ref={ref}>
    {children}
  </Flex>
));
