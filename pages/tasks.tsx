import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { purple } from '@mui/material/colors';

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
import { debounce } from '@mui/material';


function generate(element: React.ReactElement) {
  return [0, 1, 2, 3, 4, 5, 6].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

interface GymID {
  gymID: {
    id: number
  }
}

interface Task {
  id: number
  name: string
  description: string
  status: string
}

interface Reward {
  userReward: {
    id: number
    userID: number
    status: string
  }
}
interface Tasks {
  tasks: {
    id: number
    name: string
    description: string
    status: string
  }[]
}

interface GymID {
  gymID: { id: number; }
}

const Tasks: NextPage<Reward & Tasks & GymID> = ({ gymID, tasks, userReward }) => {
  const router = useRouter()
  
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const [transactionSessionId, setTransactionSessionId] = useState<
    string | null
  >(null);

  const [claimTransactionSessionId, setClaimTransactionSessionId] = useState<
    string | null
  >(null);

  const [taskProps, setTaskProps] = useState<Task>();

  const [reward, setReward] = useState<boolean>(false);

  const { user, mutateUser } = useUser();

  let isComplete = true

  tasks.forEach((el)=>{
    if (el.status !== "FINISHED") {
      isComplete = false
      
      return false
    }
  })

  const { taskStatus, rewardStatus } = {
    taskStatus: useTrackTransactionStatus({
      transactionId: transactionSessionId
    }),
    rewardStatus: useTrackTransactionStatus({
      transactionId: claimTransactionSessionId
    }) 
  }

  useEffect(() => {
    (async () => {
      if (taskStatus.status === 'signed' && taskProps?.status === "STARTED") {
        updateTaskStatus(null)
      } else if (rewardStatus.status === 'signed' && reward) {
        addReward()
      }
    })();
  
    return () => {};
  })

  const TaskButtonStatus = (props: Task) => {
    const status = props.status
  
    if (status === "NEW") {
      return <Button variant="contained" color="secondary" onClick={() => { changeTaskStatus(props) }}>
              Start
            </Button>
    } else if (status === "STARTED") {
      return <Button variant="contained" color="error" onClick={() => { changeTaskStatus(props) }}>
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

  const changeTaskStatus = async (task: Task) => {
    setTaskProps(task)
    if (task?.status === "STARTED") {
      getAddress().then(async (address) => {
        await sendCompleteTasks(address)
      })
    } else {
      await updateTaskStatus(task)
    }
    
  }

  const updateTaskStatus = async (task:any) => {
      let currentTask;

      if(task == null) {
        currentTask = taskProps
      } else {
        currentTask = task
      }

      await fetch(`api/task/${currentTask?.id}`, {
        body: JSON.stringify({
          id: currentTask?.id,
          userID: user?.id,
          status: currentTask?.status
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT'
      })
      refreshData()
  }

  const sendClaimReward = async (address:string) => {

    let abiRegistry = AbiRegistry.create(json);

    const contract = new SmartContract({ address: new Address(contractAddress), abi: abiRegistry });

    let interaction = new Interaction(contract, new ContractFunction('claim'), []);

  
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
      setClaimTransactionSessionId(sessionId);
    } 
  };

  const addReward = async () => {
    fetch(`api/reward/create`, {
      body: JSON.stringify({
        userID: user?.id,
        gymID: gymID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }).then(() => {
      refreshData()
    })
}

  const claimReward = async () => {
    setReward(true)
      getAddress().then(async (address) => {
        await sendClaimReward(address)
      })
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 5
        }}
      >
        <Typography variant="h1" color={purple['A400']} gutterBottom>
          Welcome to your gym!
        </Typography>
        <Typography variant="h3" color="common.white" gutterBottom>
          PIPERA Metaverse Gym
        </Typography>
      </Box>

      <Box sx={{ 
          flexGrow: 1,
          mt: 20
        }}
      >
        <Grid container spacing={2} 
            sx={{
              pb: 5,
              justify: "flex-end",
              alignItems: "center"
            }}
        >
          <Grid xs={8}>
          { isComplete  && userReward == null ? (
              <Grid container spacing={2} p={2}>
              <Grid md={12}>
                <Card>
                  <CardContent>
                  <Typography 
                        gutterBottom 
                        variant="body1" 
                        component="div"
                      >
                        Great job! You have completed all your tasks! It`&apos;`s time to claim your rewards and enjoy the fruits of your hard work.
                      </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid md={12} mt={2}>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button size="large" variant="contained" sx={{
                    backgroundColor: '#ffeb3b',
                    color: '#000',
                    "&:hover": {
                      backgroundColor: '#f57f17',
                    }
                  }}
                  onClick={ () => { claimReward() } }>CLAIM REWARD</Button>
                </CardActions>
              </Grid>
              </Grid>
          ) : isComplete  && userReward != null ? (
            <Grid container spacing={2} p={2}>
              <Grid md={12}>
                <Card>
                  <CardContent>
                  <Typography 
                        gutterBottom 
                        variant="body1" 
                        component="div"
                      >
                        Great, you have claimed your reward! Please wait for your next tasks.
                      </Typography>
                  </CardContent>
                </Card>
              </Grid>
              </Grid>
          ) : null }

            <Grid container spacing={2}>
            {tasks.map((task, key) => (
              <Grid key={key} xs item alignItems="center">
                <Card sx={{ width: 250 }}>
                  <CardContent>
                    <Link 
                      href={`task?id=` + task.id}
                    >
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        align="center" 
                        component="div"
                        sx={{fontWeight: 'bold'}}
                      >
                        { task.name }
                      </Typography>
                    </Link>
                    <Typography 
                      gutterBottom 
                      variant="body1" 
                      component="div"
                    >
                      {task.description.substring(0, 150)} {task.description.length >= 150 && '...'} 
                    </Typography>
                  </CardContent>
                  <CardActions style={{justifyContent: 'center'}}>
                      {TaskButtonStatus(task)}
                  </CardActions>
                </Card>
              </Grid>
            ))}  
            </Grid>
          </Grid>
          <Grid xs={4}>
            <Card sx={{
                width: '100%',
                height: 700
             }}>
              <CardContent>
                <Typography variant="h4" align="center" color="primary" gutterBottom>
                  PIPERA
                </Typography>
                <Typography variant="h5" align="center" color="primary" gutterBottom>
                  Metaverse Gym Dashboard
                </Typography>
              </CardContent>
              <CardContent>
                <List>
                  {generate(
                    <ListItem>
                      <Grid container spacing={2} 
                          sx={{
                            justify: "flex-end",
                            alignItems: "center"
                          }}
                      >
                        <Grid xs={8}>
                          <ListItemText
                            sx={{
                              align: "center"
                            }}
                          >
                            <h3>MONTHLY USERS</h3>
                          </ListItemText>
                        </Grid>
                        <Grid xs={4}>
                          <ListItemText
                            sx={{
                              align: "center"
                            }}
                          >
                            <h3>359</h3>
                          </ListItemText>
                        </Grid>
                      </Grid>
                    </ListItem>
                  )}  
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Tasks

export const getServerSideProps = withSessionSsr(
  async function GetServerSidePropsContext( { req, query } ) {
    const user = req.session.user;

    let tasks:Array<Task> = []

    let userReward = await prisma?.reward.findFirst({
      where: {
        gymID: Number(query.gym),
        userID: Number(user?.id),
        status: "CURRENT"
      },
      select: {
        id: true,
        userID: true,
        status: true
      }
    })

    let userTasks = await prisma?.user.findUnique({
      where: {
        id: Number(user?.id)
      },
      include: {
        tasks: {
          where: {
            task: {
              gymID: Number(query.gym)
            }
          },
          include: {
            task: true
          }
        }
      }
    })
  
    userTasks?.tasks.forEach((item) => {
      tasks.push({
        id: item.task.id,
        name: item.task.name,
        description: item.task.description,
        status: item.status
      })  
    })

    return {
      props: {
        gymID: Number(query.gym),
        tasks,
        userReward: userReward
      }
    }
  },
)
