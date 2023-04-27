import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';

export const Logo = () => {
  return (
    <NextLink href="/">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
          userSelect: "none"
        }}
      >
        <Typography
          cursor="pointer"
          mb={0}
          fontSize="4xl"
          fontWeight="black"
          color="dappTemplate.white"
        >
          MultiversX Dapp Template
        </Typography>
      </Box>
    </NextLink>
  );
};
