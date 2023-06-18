import React, { useState, useEffect, useRef, memo } from 'react';
import type { NextPage } from 'next'
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack  from '@mui/material/Stack';
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

import {
    StackedCarousel,
    ResponsiveContainer,
    StackedCarouselSlideProps
  } from 'react-stacked-center-carousel';

import cover from '../public/s4f-bg.jpg';
import noice from '../public/s4f-classic.png';
import Fab from '@mui/material/Fab';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


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

// const data = new Array(5).fill({ coverImage: cover, video: noice });

const data = [
  {
    id: 1,
    name: "first task to complete",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum felis eu lorem tristique suscipit. In blandit purus quis tortor dapibus, eu eleifend est condimentum. Vestibulum metus augue, ornare non libero vitae, pulvinar tristique est. In sed tincidunt purus, non varius lectus. Maecenas sit amet condimentum ante. Nunc arcu sem, fringilla eu purus at, ultricies cursus lorem. Maecenas eleifend nisi vel est varius, nec porttitor diam interdum. Nulla tincidunt nisi vel eros bibendum, eu posuere dui egestas. Quisque viverra blandit urna, a pharetra neque iaculis in. Nulla eget quam ligula. ",
    status: "NEW"
  },
  {
    id: 2,
    name: "second task to complete",
    description: "Duis suscipit pretium urna in scelerisque. Aenean id sem lacinia metus tincidunt imperdiet at vel justo. In tincidunt congue odio at sagittis.",
    status: "STARTED"
  },
  {
    id: 3,
    name: "third task to complete",
    description: "Pellentesque sollicitudin iaculis lectus, sed eleifend mi aliquam et. Donec id nunc nisi. Aliquam a mattis orci, ac viverra dolor. Cras aliquet maximus ornare.",
    status: "FINISHED"
  }
];

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

  const ref = useRef<StackedCarousel>();

  return (
    <Container maxWidth="xl">

      <Box sx={{ 
          flexGrow: 1
        }}
      >
        <Grid container spacing={2} 
            sx={{
              pb: 5,
              justify: "flex-end",
              alignItems: "center"
            }}
        >
          <Grid xs={4}>
            asd
          </Grid>
          <Grid xs={8}>
            <Box sx={{ my: 2, border: '1px solid #fff' }}>
              <Typography color="common.white">
              Title
              </Typography>
            </Box>

            <Box className="sliderBox">
              <div className='twitch'>
                <div style={{ width: '100%', position: 'relative' }}>
                  <ResponsiveContainer
                    carouselRef={ref}
                    render={(width, carouselRef) => {
                      return (
                        <StackedCarousel
                          ref={carouselRef}
                          slideComponent={Slide}
                          slideWidth={400}
                          carouselWidth={width}
                          data={data}
                          maxVisibleSlide={5}
                          disableSwipe
                          customScales={[1, 0.85, 0.7, 0.55]}
                          transitionTime={450}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Tasks

const Slide = memo(function (props: StackedCarouselSlideProps) {
  const { data, dataIndex, isCenterSlide, swipeTo, slideIndex } = props;
  const [loadDelay, setLoadDelay] = useState<any>();
  const [removeDelay, setRemoveDelay] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (isCenterSlide) {
      clearTimeout(removeDelay);
      setLoadDelay(setTimeout(() => setLoaded(true), 500));
    } else {
      clearTimeout(loadDelay);
      if (loaded) setRemoveDelay(setTimeout(() => setLoaded(false), 500));
    }
  }, [isCenterSlide]);

  useEffect(() => () => {
    clearTimeout(removeDelay);
    clearTimeout(loadDelay);
  });

  const TaskButtonStatus = (props: Task) => {
    const status = props.status
  
    if (status === "NEW") {
      return <Button variant="contained" className="taskButton" color="secondary">
              Start
            </Button>
    } else if (status === "STARTED") {
      return <Button variant="contained" className="taskButton" color="error">
              End Task
            </Button>
    } else {
      return  <Alert variant="filled" severity="success" className="taskButtonAlert">Task is done</Alert>
    }
  }

  const { name, description, status } = data[dataIndex];

  return (
    <div className={`twitch-card ${loaded ? "glow-card" : ""}`} draggable={false}>
      <div className={`cover fill ${isCenterSlide && loaded ? 'off' : 'on'}`}>
        <div
          className='card-overlay fill'
          onClick={() => {
            if (!isCenterSlide) swipeTo(slideIndex);
          }}
        />
      </div>
      {loaded && (
        <div className='detail fill'>
          <Stack 
                sx = {{
                  direction: "column",
                  align: "center"
                }}
              >
          <Typography variant='h4' align="center" color='common.white' sx={{
            my: 5,
            px: 2
          }}>
              { name }
            </Typography>
            <Typography variant='body1' color='common.white' component='p' sx={{
              my: 5
            }}>
              { description }
            </Typography>
            
            <Box position="absolute" bottom="0px" sx={{
              width: '100%',
              left: 0,
              mb: 4,
              pl:"10%"
            }}>
              {TaskButtonStatus(data[dataIndex])}
            </Box>
          </Stack> 
        </div>
      )}
    </div>
  );
});

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
