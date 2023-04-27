import { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';

export const CardItemWrapper: FC<PropsWithChildren> = (({ children }, ref) => (
  <Box flexWrap="wrap" gap={2} ref={ref}>
    {children}
  </Box>
));
