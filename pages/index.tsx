import Link from 'next/link'
import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import { purple } from '@mui/material/colors';
import { useLogin } from '@useelven/core';

// ====== for transactions =======
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useCompleteTask } from '../components/helpers/completeTask';

import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider, ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import {
  AbiRegistry,
  SmartContract,
  Address,
  Account,
  Interaction
} from '@multiversx/sdk-core/out';
import { TokenTransfer } from "@multiversx/sdk-core";
import { contractAddress } from '../config/config';
import json from '../claim.abi.json';

import { ExtensionProvider } from "@multiversx/sdk-extension-provider";


// Array interface
interface Gym {
  gyms: {
    id: number
    name: string
    status: string
  }[]
}

const Home: NextPage<Gym> = ({ gyms }) =>  {

  const {
    isLoggedIn
  } = useLogin({ token: process.env.NEXT_PUBLIC_LOGIN_TOKEN });

  const /*transactionSessionId*/ [, setTransactionSessionId] = useState<
  string | null
>(null);

  function handleColorAvailability(status: string) {
    return status === "OPEN" ? "green" : "red"
  }

  const sendCompleteTransaction = async () => {
    let abiRegistry = AbiRegistry.create(json);

    const contract = new SmartContract({ address: new Address(contractAddress), abi: abiRegistry });

    let interaction = new Interaction(contract, new ContractFunction('completeTasks'), []);

    let tx = interaction
    .withSender(new Address("erd1qdh0ay4a4s2eqxs0w2wwgtk9ne3qyey0rcpxkdf63ts6qwd2xm4qguz5yw"))
    .useThenIncrementNonceOf(new Account(new Address("erd1qdh0ay4a4s2eqxs0w2wwgtk9ne3qyey0rcpxkdf63ts6qwd2xm4qguz5yw")))
    .withGasLimit(20000000)
    .withChainID("D")
    .withValue(TokenTransfer.egldFromAmount(0))
    .buildTransaction();

    const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

    // let txHash = await proxyNetworkProvider.sendTransaction(tx); 
    // console.log("Hash:", txHash); 

    await refreshAccount();

    const { sessionId , error } = await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });
    console.log(sessionId, error)
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    } 
  };

  const sendClaimTransaction = async () => {
    const claimTransaction = {
      value: 0,
      data: 'claim',
      receiver: contractAddress
    };
    await refreshAccount();

    const { sessionId , error } = await sendTransactions({
      transactions: claimTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Task transaction',
        errorMessage: 'An error has occured during Pong',
        successMessage: 'Pong transaction successful'
      },
      redirectAfterSign: false
    });
    console.log('da', sessionId)
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  return (
    <Container maxWidth="xl">
        <Box
          sx={{
            mt: 20
          }}
        >
          <Typography variant="h1" color={purple['A400']} gutterBottom>
            Sense4FIT Metaverse Gym
          </Typography>
          <Typography variant="h4" color="common.white" gutterBottom>
            Get fit, earn rewards, and build your empire in the virtual world.
          </Typography>

          <Button variant="contained" onClick={sendCompleteTransaction}>Smart Contract Complete Task</Button>

        </Box>

        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Grid container spacing={2} sx={{ mb: 5 }}>
          {gyms.map((gym, key) => (
            <Grid key={key} xs item display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                {
                  gym.status === "OPEN" && isLoggedIn ? (
                    <Link 
                      prefetch={false}
                      style={{ textDecoration: 'none' }}
                      href={{
                        pathname: '/tasks',
                        query: { 
                          gym: gym.id
                        } 
                      }}
                    >
                      <CardContent>
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          align="center" 
                          component="div"
                          sx={{fontWeight: 'bold'}}
                        >
                          {gym.name}
                        </Typography>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          align="center" 
                          component="div"
                        >
                          Metaverse Gym
                        </Typography>
                        <Typography 
                          variant="h6" 
                          align="center" 
                          color={ handleColorAvailability(gym.status) }
                          sx={{fontWeight: 'bold'}}
                        >
                          {gym.status}
                        </Typography>
                      </CardContent>
                    </Link>
                  ) : (
                      <CardContent>
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          align="center" 
                          component="div"
                          sx={{fontWeight: 'bold'}}
                        >
                          {gym.name}
                        </Typography>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          align="center" 
                          component="div"
                        >
                          Metaverse Gym
                        </Typography>
                        <Typography 
                          variant="h6" 
                          align="center" 
                          color={ handleColorAvailability(gym.status) }
                          sx={{fontWeight: 'bold'}}
                        >
                          {gym.status}
                        </Typography>
                      </CardContent>
                  )
                }
              </Card>
            </Grid>
          ))}
          </Grid>  
        </Box>
    </Container>
  )
}

export default Home

// Server side rendering on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // READ all gyms from DB
  const gyms = await prisma?.gym.findMany({
    select: {
      name: true,
      id: true,
      status: true
    }
  })

  return {
    props: {
      gyms
    }
  }
}
