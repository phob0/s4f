import { useCallback, useState } from 'react';
import { Box, Link, CircularProgress, Typography } from '@mui/material';
import {
  TransactionCallbackParams,
  LoginMethodsEnum,
  useConfig,
  useLoginInfo,
} from '@useelven/core';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { SimpleEGLDTxDemo } from './SimpleEGLDTxDemo';
import { SimpleNftMintDemo } from './SimpleNftMintDemo';
import { SimpleScQeryDemo } from './SimpleScQueryDemo';
import { shortenHash } from '../../utils/shortenHash';
import { ActionButton } from '../tools/ActionButton';

export const SimpleDemo = () => {
  const [result, setResult] = useState<{ type: string; content: string }>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const { loginMethod } = useLoginInfo();
  const { explorerAddress } = useConfig();

  const handleTxCb = useCallback(
    ({ transaction, pending, error }: TransactionCallbackParams) => {
      if (transaction) {
        setResult({ type: 'tx', content: transaction.getHash().hex() });
        setPending(false);
        setError(undefined);
      }
      if (pending) {
        setPending(true);
        setError(undefined);
        setResult(undefined);
      }
      if (error) {
        setError(error);
        setPending(false);
        setResult(undefined);
      }
    },
    []
  );

  const handleQueryCb = useCallback(
    (queryResult: string, pending: boolean, error: string) => {
      if (queryResult) {
        setResult({ type: 'query', content: queryResult });
        setPending(false);
        setError(undefined);
      }
      if (pending) {
        setPending(true);
        setError(undefined);
        setResult(undefined);
      }
      if (error) {
        setError(error);
        setPending(false);
        setResult(undefined);
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    setResult(undefined);
    setPending(false);
    setError(undefined);
  }, []);

  return (
    <Box position="relative">
      <Box gap={8} flexWrap="wrap" justifyContent="center" mb={4}>
        <SimpleEGLDTxDemo cb={handleTxCb} />
        <SimpleNftMintDemo cb={handleTxCb} />
        <SimpleScQeryDemo cb={handleQueryCb} />
      </Box>
      {error && (
        <FlexCardWrapper
          position="absolute"
          inset={0}
          bg="blackAlpha.200"
          backdropFilter="blur(10px)"
        >
          <Box fontSize="x-large" fontWeight="black">
            Transaction status:
          </Box>
          <Box fontSize="lg">{error}</Box>
          <ActionButton mt={4} onClick={handleClose}>
            Close
          </ActionButton>
        </FlexCardWrapper>
      )}
      {pending && (
        <FlexCardWrapper
          position="absolute"
          inset={0}
          bg="blackAlpha.200"
          backdropFilter="blur(10px)"
        >
          <Box fontSize="x-large" fontWeight="black">
            Transaction is pending. Please wait.
          </Box>
          {loginMethod === LoginMethodsEnum.walletconnect && (
            <Box>
              Confirm it on the xPortal mobile app and wait till it finishes.
            </Box>
          )}
          {loginMethod === LoginMethodsEnum.ledger && (
            <Box>
              Then wait some time to finish the transaction. You will get the
              transaction hash and link at the end.
            </Box>
          )}
          <CircularProgress mt={6} color="dappTemplate.color2.darker" />
        </FlexCardWrapper>
      )}
      {result?.type && (
        <FlexCardWrapper
          position="absolute"
          inset={0}
          bg="blackAlpha.200"
          backdropFilter="blur(10px)"
        >
          {result.type === 'tx' ? (
            <>
              <Box fontSize="x-large" fontWeight="black">
                Transaction hash:
              </Box>
              <Link
                underline='always'
                href={`${explorerAddress}/transactions/${result.content}`}
                sx={{
                  fontSize: "large"
                }}
                target="_blank"
              >
                {shortenHash(result.content, 10)}
              </Link>
            </>
          ) : (
            <>
              <Box fontSize="x-large" fontWeight="black">
                Query result
              </Box>
              <Box fontSize="large">
                There is{' '}
                <Typography fontWeight="black" fontSize="xl" display="inline-block">
                  {result.content}
                </Typography>{' '}
                NFTs left to mint!
              </Box>
            </>
          )}
          <ActionButton 
           sx={{ mt: 4 }}  onClick={handleClose}>
            Close
          </ActionButton>
        </FlexCardWrapper>
      )}
    </Box>
  );
};
