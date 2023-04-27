import { FC, useCallback, useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { LoginMethodsEnum, useLoginInfo } from '@useelven/core';
import { ActionButton } from './ActionButton';
import { shortenHash } from '../../utils/shortenHash';
import { errorParse } from '../../utils/errorParse';

interface LedgerAccountsListProps {
  getHWAccounts: (page?: number, pageSize?: number) => Promise<string[]>;
  resetLoginMethod: () => void;
  handleLogin: (
    type: LoginMethodsEnum,
    ledgerAccountsIndex?: number
  ) => () => void;
}

const ADDRESSES_PER_PAGE = 10;
const LEDGER_NOT_CONNECTED_CODE = 0x6e01;
const LEDGER_DISCONNECTED = 'DisconnectedDeviceDuringOperation';

export const LedgerAccountsList: FC<LedgerAccountsListProps> = ({
  getHWAccounts,
  resetLoginMethod,
  handleLogin,
}) => {
  const [accounts, setAccounts] = useState<string[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [listPending, setListPending] = useState(true);
  const [error, setError] = useState<string>();
  const [chosenAddress, setAddress] = useState<string>();

  const { loginToken } = useLoginInfo();

  const mounted = useRef(false);

  const router = useRouter();

  useEffect(() => {
    mounted.current = true;

    const fetch = async () => {
      try {
        mounted.current && setListPending(true);
        const accounts = await getHWAccounts(currentPage, ADDRESSES_PER_PAGE);
        if (accounts?.length > 0 && mounted.current) setAccounts(accounts);
      } catch (e) {
        const err = e as { statusCode: number; name: string };
        if (
          (err.statusCode === LEDGER_NOT_CONNECTED_CODE ||
            err.name === LEDGER_DISCONNECTED) &&
          mounted.current
        ) {
          setError(
            'Not connected, please check the connection and make sure that you have the MultiversX app opened on your Ledger device.'
          );
        } else {
          setError(`Error: ${errorParse(e)}`);
        }
      } finally {
        mounted.current && setListPending(false);
      }
    };
    fetch();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prevState) => (prevState > 0 ? prevState - 1 : prevState));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prevState) => prevState + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    router.reload();
  }, [router]);

  const login = useCallback(
    (index: number, address: string) => () => {
      handleLogin(LoginMethodsEnum.ledger, index)();
      setAddress(address);
    },
    [handleLogin]
  );

  useEffect(() => {
    if (!listPending && !accounts && !error) {
      resetLoginMethod();
    }
  }, [accounts, error, listPending, resetLoginMethod]);

  if (listPending) {
    return (
      <Box 
        sx = {{
          mt: 6,
          direction: "column",
          justify: "center",
          align: "center"
        }}
        >
        <CircularProgress />
        <Box marginTop={3}>Loading addresses, please wait...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        textAlign="center"
        marginLeft="auto"
        marginRight="auto"
        marginTop={6}
      >
        <Typography>{error}</Typography>
        <ActionButton mt={4} onClick={handleRefresh}>
          Refresh
        </ActionButton>
      </Box>
    );
  }

  if (!accounts) return null;

  if (chosenAddress)
    return (
      <Box 
        sx = {{
          mt: 6,
          direction: "column",
          justify: "center",
          align: "center"
        }}>
        <CircularProgress />
        <Box mt={3}>Confirm on the Ledger device:</Box>
        <Box mt={3} wordBreak="break-word" textAlign="center">
          <Box fontWeight="bold">Address:</Box> {chosenAddress}
        </Box>
        {loginToken && (
          <Box mt={3}>
            <Box fontWeight="bold">Auth token:</Box> {loginToken}
            {'{}'}
          </Box>
        )}
      </Box>
    );

  return (
    <Box marginLeft="auto" marginRight="auto" marginTop={6}>
      <Typography fontWeight="semibold" textAlign="center" mb={2}>
        Choose address:
      </Typography>
      {accounts?.map((account: string, index: number) => (
        <Box
          key={account}
          marginBottom={0.5}
          cursor="pointer"
          border="1px solid transparent"
          borderRadius="md"
          _hover={{ border: '1px dotted #fff', paddingLeft: 2 }}
          transition="padding-left 0.2s"
          padding={1}
          onClick={login(index, account)}
        >
          <Box as="span" display="inline-block" textAlign="center" minWidth={4}>
            {index + currentPage * ADDRESSES_PER_PAGE}
          </Box>
          :
          <Box
            as="span"
            display="inline-block"
            marginLeft={4}
            textAlign="center"
          >
            {shortenHash(account, 11)}
          </Box>
        </Box>
      ))}
      <Flex justifyContent="space-between" marginTop={6}>
        <Typography
          onClick={handlePrev}
          cursor={currentPage === 0 ? 'not-allowed' : 'pointer'}
          opacity={currentPage === 0 ? 0.5 : 1}
        >
          Prev
        </Typography>
        <Typography onClick={handleNext} cursor="pointer">
          Next
        </Typography>
      </Flex>
    </Box>
  );
};
