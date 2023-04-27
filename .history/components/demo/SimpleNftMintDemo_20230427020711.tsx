import { Link, Text } from '@chakra-ui/react';
import {
  U32Value,
  ContractFunction,
  ContractCallPayloadBuilder,
  TokenTransfer,
} from '@multiversx/sdk-core';
import {
  useTransaction,
  TransactionCallbackParams,
  useConfig,
} from '@useelven/core';
import { useCallback } from 'react';
import { ActionButton } from '../tools/ActionButton';
import { shortenHash } from '../../utils/shortenHash';
import { FlexCardWrapper } from '../ui/CardWrapper';

const mintSmartContractAddress =
  process.env.NEXT_PUBLIC_MINT_SMART_CONTRACT_ADDRESS || '';
const mintFunctionName = process.env.NEXT_PUBLIC_MINT_FUNCTION_NAME || '';
const mintPaymentPerToken =
  process.env.NEXT_PUBLIC_MINT_PAYMENT_PER_TOKEN || '';

export const SimpleNftMintDemo = ({
  cb,
}: {
  cb: (params: TransactionCallbackParams) => void;
}) => {
  const { pending, triggerTx } = useTransaction({ cb });
  const { explorerAddress, chainType } = useConfig();

  const handleSendTx = useCallback(() => {
    // Prepare data payload for smart contract using MultiversX JS SDK core tools
    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction(mintFunctionName))
      .setArgs([new U32Value(1)])
      .build();

    triggerTx({
      address: mintSmartContractAddress,
      gasLimit: 14000000,
      value: TokenTransfer.egldFromAmount(mintPaymentPerToken),
      data,
    });
  }, [triggerTx]);

  return (
    <FlexCardWrapper>
      <Text mb={4}>
        2. You will be minting one NFT using{' '}
        <a href="https://www.elven.tools">Elven Tools</a> smart contract: <br />
        <Link
          href={`${explorerAddress}/accounts/${mintSmartContractAddress}`}
          fontWeight="bold"
        >
          {shortenHash(mintSmartContractAddress, 8)}
        </Link>{' '}
        <br />({chainType}, max 10 NFTs per address)
      </Text>
      <ActionButton disabled={pending} onClick={handleSendTx}>
        <Text>Mint</Text>
      </ActionButton>
    </FlexCardWrapper>
  );
};
