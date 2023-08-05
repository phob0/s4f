import React, { useState, useEffect, useRef, memo, useContext, use } from 'react';
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

import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks/transactions';
import { getAccountBalance } from '@multiversx/sdk-dapp/utils/account';

import {
    StackedCarousel,
    ResponsiveContainer,
    StackedCarouselSlideProps
  } from 'react-stacked-center-carousel';

import { useGetTokensInfo, useGetTotalClaimed, useGetCanUserCompleteTasks, useGetUserClaimable, useGetUserStakedInfo } from '../utils/services/hooks'
import { completeTasks, claim } from '../utils/services/calls'
import useGetUserNfts from '@/hooks/useGetUserNfts';
import { IElrondNFT } from '@/utils/types/sc.interface';
import { formatBalance } from '@/utils/functions/formatBalance';
import { Tooltip } from '@mui/material';
import useGetUserToken from '@/hooks/useGetUserToken';
import NextImage from '@/components/NextImage/NextImage';

import { FaCheckCircle, FaHourglass } from 'react-icons/fa';
import { MdCheckCircle, MdHourglassEmpty } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline, IoMdCheckmarkCircle } from 'react-icons/io';
import { AiOutlineCheckCircle, AiOutlineHourglass } from 'react-icons/ai';
import { BsCheckCircle, BsHourglass } from 'react-icons/bs';
import { adminAddresses } from '@/config/constants';

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
  const roundedValue = Math.round(props.value * 100) / 100;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} ml={2}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 40 }}>
        <Typography variant="body2" color="text.secondary">{`${roundedValue} %`}</Typography>
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
  const [claimedRewards, setClaimedRewards] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<boolean>(false);

  useEffect(() => {
    if (eventSignal != null) {
      updateTaskStatus(eventSignal)
    }
  })

  const { user, mutateUser } = useUser();

  let isComplete = true

  let totalCompleted = 0

  tasks.forEach((el)=>{
    if (el.status !== "FINISHED") {
      isComplete = false
    } else if (el.status === "FINISHED") {
      totalCompleted++
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

  const activeTasks = tasks.filter(task => task.status === 'STARTED')
  
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

  const ref = useRef<StackedCarousel>();

  const accountInfo = useGetAccount();
  
  const connectedUserAddress = accountInfo.address;


  // QUERIES
  const { tokensInfo, isLoadingTokensInfo, errorTokensInfo} = useGetTokensInfo(); // GYM NFT, SFITLEGENDS NFT, & SFIT TOKEN
  const { totalClaimed, isLoadingTotalClaimed, errorTotalClaimed} = useGetTotalClaimed(connectedUserAddress);

  const { canCompleteTasks, isLoadingCanCompleteTasks, errorCanCompleteTasks} = useGetCanUserCompleteTasks(connectedUserAddress);
  const { userClaimable, isLoadingUserClaimable, errorUserClaimable} = useGetUserClaimable(connectedUserAddress);
  const { nfts: gymNfts, isLoadingNfts, isErrorNfts } = useGetUserNfts(connectedUserAddress, tokensInfo?.[0]?.token);
  const { userStakedInfo: stakedGymNfts, isLoadingUserStakedInfo: isLoadingStakedGymNfts, errorUserStakedInfo: isErrorStakedGymNfts }  = useGetUserStakedInfo(connectedUserAddress);
  const sfitIdentifier = tokensInfo ? tokensInfo[2]?.token : "";
  const {userToken: userSfitTokenInfo, isLoadingUserToken, isErrorUserToken} = useGetUserToken(connectedUserAddress, sfitIdentifier);
  const { nfts: sfitLegendNfts, isLoadingNfts: isLoadingSfitLegendsNfts, isErrorNfts: isErrorSfitLegendsNfts }  = useGetUserNfts(connectedUserAddress, tokensInfo?.[1]?.token);

  const numberOfGymNftsInWallet = gymNfts.length > 0 ? gymNfts.length : 0;
  const numberOfGymNftsStaked = stakedGymNfts ? stakedGymNfts?.length : 0;
  const numberOfSfitLegendNftsInWallet = sfitLegendNfts ? sfitLegendNfts.length : 0;

  const claimableAmount = userClaimable ? userClaimable?.amount : 0
  const totalClaimedAmount = totalClaimed ? totalClaimed?.amount : 0
  const userSfitBalance = userSfitTokenInfo?.balance ? userSfitTokenInfo?.balance : 0;

  const canClickClaim = totalCompleted == tasks.length && numberOfSfitLegendNftsInWallet > 0 && numberOfGymNftsStaked > 0;

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
              pt: 15,
              justify: "flex-end",
              alignItems: "center"
            }}
        >
          <Grid xs={4} sx={{ pr: 3 }}>
            <Stack spacing={3} sx={{ pr: 3 }}>
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
                    <Grid xs={6} container direction={"row"} justifyContent={"center"} gap={1}>
                      <Typography color="common.white" align="center">
                        {
                          formatBalance(
                            {
                              balance: Number(userSfitBalance),
                              decimals: 18,
                              withDots: false
                            },
                            false
                          )
                        }
                      </Typography>
                      <NextImage 
                        src={"/demo_imgs/sfit.png"}
                        alt={"sfitLegendNFT"}
                        width={24}
                        height={24}
                        loading='lazy'
                      />
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
                    CONDITIONS TO CLAIM
                  </Typography>
                </CardContent>
                <CardContent>
                  <Grid container spacing={2} direction={"column"} px={2} gap={1}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography color="common.white" align="center">
                          1. OWN AT LEAST 1 SFITLEGEND NFT
                        </Typography>
                      </Grid>
                      <Grid item>
                        {numberOfSfitLegendNftsInWallet > 0 ?
                          <BsCheckCircle size={20}/> :
                          <BsHourglass size={20}/>
                        }
                      </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography color="common.white" align="center">
                          2. HAVE STAKED AT LEAST 1 GYM NFT
                        </Typography>
                      </Grid>
                      <Grid item>
                        {numberOfGymNftsStaked > 0 ?
                          <BsCheckCircle size={20}/> :
                          <BsHourglass size={20}/>
                        }
                      </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography color="common.white" align="center">
                          3. COMPLETE ALL TASKS
                        </Typography>
                      </Grid>
                      <Grid item>
                        {totalCompleted == tasks.length ?
                          <BsCheckCircle size={20}/> :
                          <BsHourglass size={20}/>
                        }
                      </Grid>
                    </Grid>
                    <Grid xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={12}
                      >
                        <Tooltip 
                          title={canClickClaim ? (
                            claimableAmount > 0 ?
                              "Claim" :
                              "Nothing to claim"
                          ) : (
                            "You must complete all the the above conditions."
                          )}
                        >
                          <span>
                            <Button 
                              className="claimButton"
                              variant="contained" 
                              size="large" 
                              disabled={claimableAmount == 0 || sfitLegendNfts.length == 0 || claimedRewards}
                              onClick={ () => {
                                claim(connectedUserAddress, sfitLegendNfts[0].collection, sfitLegendNfts[0].nonce);
                                setClaimedRewards(true);
                              }}
                              sx={{
                                marginTop: 3
                              }}  
                            >
                              Claim Reward
                            </Button>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card className="statsWell">
                <CardContent>
                  <Typography color="common.white" variant="h5" component="div" align="center" px={5}>
                    YOUR PARTICIPATION IN { gymName } GYM
                  </Typography>
                  
                </CardContent>  
                <CardContent>
                <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        CLAIMABLE SFIT
                      </Typography>
                    </Grid>
                    <Grid xs={6} container direction={"row"} justifyContent={"center"} gap={1}>
                      <Typography color="common.white" align="center">
                        {
                          formatBalance(
                            {
                              balance: Number(claimableAmount),
                              decimals: 18,
                            },
                            true
                          )
                        }
                      </Typography>
                      <NextImage 
                        src={"/demo_imgs/sfit.png"}
                        alt={"sfitLegendNFT"}
                        width={24}
                        height={24}
                        loading='lazy'
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        SFIT EARNED SO FAR
                      </Typography>
                    </Grid>
                    <Grid xs={6} container direction={"row"} justifyContent={"center"} gap={1}>
                      <Typography color="common.white" align="center">
                        {
                          formatBalance(
                            {
                              balance: Number(totalClaimedAmount),
                              decimals: 18,
                            },
                            true
                          )
                        }
                      </Typography>
                      <NextImage 
                        src={"/demo_imgs/sfit.png"}
                        alt={"sfitLegendNFT"}
                        width={24}
                        height={24}
                        loading='lazy'
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        GYM NFTS IN WALLET
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        {numberOfGymNftsInWallet}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        GYM NFTS STAKED
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        {numberOfGymNftsStaked}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        OWNERSHIP PERCENTAGE
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={numberOfGymNftsStaked / 10} />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        ACTIVE TASKS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={activeTasks.length * 100 / tasks.length}/>
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        COMPLETED TASKS
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <LinearProgressWithLabel value={totalCompleted * 100 / tasks.length}/>
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
                    <Grid xs={6} container direction={"row"} justifyContent={"center"} gap={1}>
                      <Typography color="common.white" align="center">
                        1,557,465
                      </Typography>
                      <NextImage 
                        src={"/demo_imgs/sfit.png"}
                        alt={"sfitLegendNFT"}
                        width={24}
                        height={24}
                        loading='lazy'
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Typography color="common.white" align="center">
                        TOTAL SFIT LAST MONTH
                      </Typography>
                    </Grid>
                    <Grid xs={6} container direction={"row"} justifyContent={"center"} gap={1}>
                      <Typography color="common.white" align="center">
                        57,465
                      </Typography>
                      <NextImage 
                        src={"/demo_imgs/sfit.png"}
                        alt={"sfitLegendNFT"}
                        width={24}
                        height={24}
                        loading='lazy'
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>  
          </Grid>
          <Grid xs={8} justifyContent={"center"}>
            <Box className="titleBox" sx={{ my: 1, border: '1px solid #fff', py: 3 }}>
              <Typography variant="h4" color="common.white" align="center">
                Welcome to your Gym!
              </Typography>
              <Typography variant="h2" color="common.black" align="center">
                { gymName } Metaverse Gym
              </Typography>
            </Box>

            <Box className="sliderBox">

                {/* <Typography variant="h6" component="div" color="common.white" align="right" sx={{ mr: 5, mt: 2, mb: 2 }}>
                  Completed Tasks: { totalCompleted }/{ tasks.length }
                </Typography> */}
                
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
                          customScales={[1, 0.85, 0.7, 0.55]}
                          transitionTime={450}
                          useGrabCursor={true}
                        />
                      );
                    }}
                  />
                </div>
              </div>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={12}
                  mb={3}
                >
                <Button className="claimButton" variant="contained" size="large"
                  disabled={!canCompleteTasks?.canCompleteTasks || !isComplete || completedTasks}
                  onClick={() => {
                    completeTasks(connectedUserAddress);
                    setCompletedTasks(true);
                  }}
                >
                  Complete Tasks
                </Button>

                </Stack> 
            </Box>
            {adminAddresses.includes(connectedUserAddress) && <div style={{ padding: "25px", display: "flex", justifyContent: "center" }}>
                <Button className='depositButton'>
                  Deposit Rewards (not ready yet)
                </Button>
            </div>}
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
  const [loaded, setLoaded] = useState(true);
  const slideContext = useContext(SlideContext);

  useEffect(() => {
    if (isCenterSlide) {
      clearTimeout(removeDelay);
      setLoadDelay(setTimeout(() => setLoaded(true), 50));
    } else {
      clearTimeout(loadDelay);
      if (loaded) setRemoveDelay(setTimeout(() => setLoaded(false), 50));
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