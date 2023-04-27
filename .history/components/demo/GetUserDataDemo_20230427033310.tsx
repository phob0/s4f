import { TokenTransfer } from '@multiversx/sdk-core';
import { Typography, Link } from '@mui/material';
import { shortenHash } from '../../utils/shortenHash';
import { useAccount, useConfig } from '@useelven/core';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { CardItemWrapper } from './CardItemWrapper';

export const GetUserDataDemo = () => {
  const { address, nonce, balance } = useAccount();
  const { explorerAddress } = useConfig();

  return (
    <FlexCardWrapper alignItems="flex-start" justifyContent="flex-start">
      <Typography fontSize="xl" mb={2} fontWeight="black">
        User data:
      </Typography>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          address:
        </Typography>{' '}
        <Link
          textDecoration="underline"
          href={`${explorerAddress}/accounts/${address}`}
        >
          {shortenHash(address, 8)}
        </Link>
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          nonce:
        </Typography>{' '}
        {nonce}
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          balance:
        </Typography>{' '}
        {balance
          ? parseFloat(
              TokenTransfer.egldFromBigInteger(balance).toPrettyString()
            )
          : '-'}
      </CardItemWrapper>
    </FlexCardWrapper>
  );
};
