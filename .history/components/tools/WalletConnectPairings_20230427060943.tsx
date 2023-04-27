import { FC, MouseEventHandler } from 'react';
import { PairingTypes } from '@useelven/core';
import { Stack, Box, Typography, Heading, IconButton } from '@mui/material';
import { CloseIcon } from '@mui/icons-material';

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
        <Heading size="md" mt={4}>
          Existing pairings:
        </Heading>
      )}
      {pairings.map((pairing) => (
        <Box
          bgColor="dappTemplate.white"
          py={2}
          px={4}
          pr={8}
          borderRadius="md"
          key={pairing.topic}
          cursor="pointer"
          onClick={handleLogin(pairing.topic)}
          userSelect="none"
          position="relative"
        >
          <IconButton
            position="absolute"
            top={2}
            right={2}
            aria-label="remove-pairing"
            color="dappTemplate.dark.base"
            h={6}
            minW={6}
            icon={<CloseIcon boxSize={2} />}
            onClick={handleRemove(pairing.topic)}
          />
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
