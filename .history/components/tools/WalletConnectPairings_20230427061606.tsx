import { FC, MouseEventHandler } from 'react';
import { PairingTypes } from '@useelven/core';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface WalletConnectPairingsProps {
  pairings: PairingTypes.Struct[];
  login: (topic: string) => Promise<void>;
  remove: (topic: string) => Promise<void>;
}

export const WalletConnectPairings: FC<WalletConnectPairingsProps> = ({
  pairings,
  login,
  remove,
}) => {
  const handleLogin = (topic: string) => () => {
    login(topic);
  };

  const handleRemove =
    (topic: string): MouseEventHandler<HTMLButtonElement> | undefined =>
    (e) => {
      e.stopPropagation();
      remove(topic);
    };

  return (
    <Stack>
      {pairings?.length > 0 && (
        <Typography variant="h4" mt={4}>
          Existing pairings:
        </Typography>
      )}
      {pairings.map((pairing) => (
        <Box
          py={2}
          px={4}
          pr={8}
          key={pairing.topic}
          onClick={handleLogin(pairing.topic)}
          sx = {{
            cursor: "pointer",
            userSelect: "none",
            position: "relative"
          }}
        >
          <IconButton
            onClick={handleRemove(pairing.topic)}
          >
            <Close />
          </IconButton>
          <Typography fontSize="lg" color="dappTemplate.dark.base">
            {pairing.peerMetadata?.name}
          </Typography>
          {pairing.peerMetadata?.url ? (
            <Typography fontSize="xs" color="dappTemplate.dark.base">
              ({pairing.peerMetadata.url})
            </Typography>
          ) : null}
        </Box>
      ))}
    </Stack>
  );
};
