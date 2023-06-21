import React, { useState, useEffect, useRef, memo, useContext } from 'react';
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
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
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

interface GymName {
  gymName: string;
}

interface SlideProps extends StackedCarouselSlideProps {
  signal: string
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}`}</Typography>
      </Box>
    </Box>
  );
}

interface SlideContextValue {
  eventSignal: Task | null;
  setEventSignal: React.Dispatch<React.SetStateAction<Task | null>>;
}

const SlideContext = React.createContext<SlideContextValue 
| undefined>(undefined);

const Tasks: NextPage<Reward & Tasks & GymID & GymName> = ({ gymName, gymID, tasks, userReward }) => {
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

  const [taskProps, setTaskProps] = useState<Task | null>();

  const [reward, setReward] = useState<boolean>(false);

  const [eventSignal, setEventSignal] = useState<Task | null>(null);

  useEffect(() => {
    console.log(eventSignal)
    if (eventSignal != null) {
      changeTaskStatus(eventSignal)
    }
  })

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

      setEventSignal(null)
      
      if (sessionId != null) {
        setTransactionSessionId(sessionId);
      } 
  };

  const changeTaskStatus = async (task: Task | null) => {
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

      setEventSignal(null)

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
    <SlideContext.Provider value={{eventSignal, setEventSignal}}>
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
          <Grid xs={4} sx={{ pr: 3 }}>
            <Stack spacing={2} sx={{ pr: 3 }}>
              <Card className="statsWell">
                <CardContent>
                  <Typography color="common.white" variant="h5" component="div" align="center">
                    YOUR WALLET PORTFOLIO
                  </Typography>
                  
                </CardContent>  
                <CardContent>
                <Grid container spacing={2} >
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        OWNED SFIT
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        32,467,050
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        PARTICIPATION IN GYMS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={76} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card className="statsWell">
                <CardContent>
                  <Typography color="common.white" variant="h5" component="div" align="center">
                    YOUR PARTICIPATION IN { gymName } GYM
                  </Typography>
                  
                </CardContent>  
                <CardContent>
                <Grid container spacing={2} >
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        CLAIMABLE SFIT
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        467,050
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        ACTIVE TASKS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={6} />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        NUMBER OF NFTS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={56} />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        OWNERSHIP PERCENTAGE
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={16} />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        SFIT EARNED SO FAR
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        467,050
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card className="statsWell">
                <CardContent>
                  <Typography color="common.white" variant="h5" component="div" align="center">
                    OVERALL STATISTICS
                  </Typography>
                  
                </CardContent>  
                <CardContent>
                <Grid container spacing={2} >
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        NUMBER OF OWNERS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        32
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        NUMBER OF MEMBERS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        1321
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        COMPLETE TASKS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        84
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        NEXT TASKS BATCH IN
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        6D : 11H : 57M : 3S
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        TOTAL SFIT GENERATED
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        1,557,465
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        TOTAL SFIT LAST MONTH
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        57,465
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>  
          </Grid>
          <Grid xs={8}>
            <Box className="titleBox" sx={{ my: 2, border: '1px solid #fff' }}>
              <Typography variant="h4" color="common.white" align="center">
                Welcome to your
              </Typography>
              <Typography variant="h2" color="common.black" align="center">
                { gymName } Metaverse Gym
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
                          data={tasks}
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
    </SlideContext.Provider>
  )
}

export default Tasks

const Slide = memo(function (props: StackedCarouselSlideProps) {
  const { data, dataIndex, isCenterSlide, swipeTo, slideIndex } = props;
  const [loadDelay, setLoadDelay] = useState<any>();
  const [removeDelay, setRemoveDelay] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  const slideContext = useContext(SlideContext);

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

  const changeSignal = (task: Task) => {
    slideContext?.setEventSignal(task)
  }

  // console.log(signal)

  const TaskButtonStatus = (props: Task) => {
    const status = props.status
  
    if (status === "NEW") {
      return <Button variant="contained" className="taskButton" color="secondary" onClick={ () => { changeSignal(props) } }>
              Start
            </Button>
    } else if (status === "STARTED") {
      return <Button variant="contained" className="taskButton" color="error" onClick={ () => { changeSignal(props) } }>
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

Slide.displayName = 'Slide';

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

    let gym = await prisma?.gym.findUnique({
      where: {
        id: Number(query.gym)
      }
    })

    return {
      props: {
        gymName: gym?.name,
        gymID: Number(query.gym),
        tasks,
        userReward: userReward
      }
    }
  },
)
