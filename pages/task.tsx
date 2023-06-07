import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import { purple } from '@mui/material/colors';
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';

import useUser from "../lib/useUser";

import { withSessionSsr } from "../lib/session";

import {
  AbiRegistry,
  SmartContract,
  Address,
  Account,
  Interaction
} from '@multiversx/sdk-core/out';
import { TokenTransfer } from "@multiversx/sdk-core";
import { ContractFunction } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import json from '../claim.abi.json';
import { contractAddress } from '../config/config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks/transactions';

interface Task {
  task: {
    id: number
    name: string
    description: string
    status: string
  }
}

type PropTaskType = {
  id: number;
  name: string;
  description: string;
  status: string;
};

interface PropTask {
  id: number
  name: string
  description: string
  status: string
}

const Task:NextPage<Task> = ({ task }) =>  {
  const router = useRouter()

  const { user, mutateUser } = useUser();

  const [transactionSessionId, setTransactionSessionId] = useState<
    string | null
  >(null);

  const [taskProps, setTaskProps] = useState<PropTask>();

  const refreshData = () => {
    router.replace(router.asPath)
  }

  function handleColorStatus(status: string) {
    return status === "NEW" ? "red" : status === "STARTED" ? "yellow" : "green"
  }

  const { status } = useTrackTransactionStatus({
    transactionId: transactionSessionId
  })

  useEffect(() => {
    (async () => {
      if (status === 'signed' && taskProps?.status === "STARTED") {
        updateTaskStatus()
      }
    })();
  
    return () => {};
  });

  const TaskButtonStatus = (props: PropTask) => {
    const status = props.status
  
    if (status === "NEW") {
      return <Button variant="contained" color="secondary" onClick={() => changeTaskStatus(props)}>
              Start
            </Button>
    } else if (status === "STARTED") {
      return <Button variant="contained" color="error" onClick={() => changeTaskStatus(props)}>
              End Task
            </Button>
    } else {
      return <Alert variant="filled" severity="success">Task is done</Alert>
    }
  }

  const sendCompleteTasks = async (address:string) => {

    let abiRegistry = AbiRegistry.create(json);

    const contract = new SmartContract({ address: new Address(contractAddress), abi: abiRegistry });

    let interaction = new Interaction(contract, new ContractFunction('completeTasks'), []);

  
    let tx = interaction
    .withSender(new Address(address))
    .useThenIncrementNonceOf(new Account(new Address(address)))
    .withGasLimit(20000000)
    .withChainID("D")
    .withValue(TokenTransfer.egldFromAmount(0))
    .buildTransaction();

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({
      transactions: tx,
      callbackRoute: '/',
      transactionsDisplayInfo: {
        processingMessage: 'Processing Complete Task transaction',
        errorMessage: 'An error has occured during Complete Task',
        successMessage: 'Complete Task transaction successful'
      },
      redirectAfterSign: false
    });
    
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    } 
  };

  const changeTaskStatus = async (task: PropTask) => {
    setTaskProps(task)
    if (task?.status === "STARTED") {
      getAddress().then(async (address) => {
        await sendCompleteTasks(address)
      })
    } else {
      await updateTaskStatus()
    }
  }

  const updateTaskStatus = async () => {
      fetch(`api/task/${taskProps?.id}`, {
        body: JSON.stringify({
          id: taskProps?.id,
          userID: user?.id,
          status: taskProps?.status
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT'
      }).then(() => {
        refreshData()
      })
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h1" color={purple['A400']} gutterBottom>
          { task.name }
        </Typography>
        <Typography variant="h3" color={ handleColorStatus(task.status) } gutterBottom>
          { task.status }
        </Typography>
      </Box>

      <Grid container spacing={2} 
            sx={{
              mt: 10,
              px: 10,
              pb: 5,
              justify: "flex-end",
              alignItems: "center"
            }}
        >
          <Grid xs={12}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography 
                  gutterBottom 
                  variant="body1" 
                  component="div"
                >
                  { task.description }  
                </Typography>
              </CardContent>
              <CardActions style={{justifyContent: 'center'}}>
                {TaskButtonStatus(task)}
              </CardActions>
            </Card>
          </Grid>
      </Grid>

    </Container>
  )
}

export default Task

export const getServerSideProps = withSessionSsr(
  async function GetServerSidePropsContext( { req, query } ) {
    const user = req.session.user;

    let taskUser = await prisma?.user.findUnique({
      where: {
        id: Number(user?.id)
      },
      include: {
        tasks: {
          where: {
            id: Number(query.id)
          },
          include: {
            task: true
          }
        }
      }
    })
    
    const task = {
      id: Number(taskUser?.tasks[0].taskID),
      name: taskUser?.tasks[0].task.name,
      description: taskUser?.tasks[0].task.description,
      status: taskUser?.tasks[0].status
    }

    return {
      props: {
        task
      }
    }
  },
)

