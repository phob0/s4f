import Link from 'next/link'
import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Tooltip from '@mui/joy/Tooltip';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { purple } from '@mui/material/colors';
import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetAllowedGymNfts, useGetCanUserCompleteTasks, useGetTokensInfo, useGetTotalClaimed, useGetUnbondingDuration, useGetUserClaimable, useGetUserStakedInfo } from '@/utils/services/hooks';
import { claim, completeTasks, stake, stakeMulti, unstake } from '@/utils/services/calls';
import { Button } from '@mui/material';
// import { useGetTotalClaimed } from '@/utils/hooks/hooks';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import React, { useState, useEffect } from 'react';
import useGetUserNfts from '@/hooks/useGetUserNfts';
import useGetNft from '@/hooks/useGetNft';
import useGetNfts from '@/hooks/useGetNfts';
import { createIndentifierByCollectionAndNonce } from '@/utils/functions/tokens';
import { getTimeString } from '@/utils/functions/timeToString';
import NextImage from "../components/NextImage/NextImage";
import { Tabs, Tab } from '@mui/material';

const gymPiperaImage = '/demo_imgs/gym_nft.jpeg';
const sfitLegendImage = '/demo_imgs/sfitlegend.png';

function TabPanel(props: { children: any; value: any; index: any; }) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Array interface
interface Gym {
  gyms: {
    id: number
    name: string
    status: string
  }[]
}

const getCurrentTimestampInSeconds = () => {
  const currentTimestampInMilliseconds = new Date().getTime();
  const currentTimestampInSeconds = Math.floor(currentTimestampInMilliseconds / 1000);
  return currentTimestampInSeconds;
};

const Home: NextPage<Gym> = ({ gyms }) =>  {

  const { isLoggedIn } = useGetLoginInfo();
  const accountInfo = useGetAccount();

  const [panel1, setPanel1] = useState(true);
  const [panel2, setPanel2] = useState(true);
  const [allGymNfts, setAllGymNfts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [gymNfts, setGymNfts] = useState<any[]>([]);
  const [gymNftsLength, setGymNftsLength] = useState(0);

  const connectedUserAddress = accountInfo.address;

  // QUERIES
  const { tokensInfo, isLoadingTokensInfo, errorTokensInfo } = useGetTokensInfo(); // (intended to be run in a specific Gym - here only to get SFITLEGENDS & SFIT TOKEN)
  const { gymNftsInfo, isLoadingGymNftsInfo, errorGymNftsInfo } = useGetAllowedGymNfts();
  const { unbondingDuration, isLoadingUnbondingDuration, errorUnbondingDuration } = useGetUnbondingDuration(); // for the user to know after how many seconds will be able to unstake a GYM NFT

  // TOKENS (intended to be run in a specific Gym, not here)
  // let gymNftsIdentifier = "";
  let sfitLegendsNftsIdentifier = "";
  // let sfitTokenIdentifier = "";
  if (!isLoadingTokensInfo && tokensInfo?.length == 3) {
    // gymNftsIdentifier = tokensInfo[0]?.token;
    sfitLegendsNftsIdentifier = tokensInfo[1]?.token;
    // sfitTokenIdentifier = tokensInfo[2]?.token;
  }

  console.log(" ");

  // SFITLEGENDS BALANCE IN WALLET
  const { nfts: sfitLegendsNfts, isLoadingNfts: isLoadingSfitLegendsNfts, isErrorNfts: isErrorSfitLegendsNfts }  = useGetUserNfts(connectedUserAddress, sfitLegendsNftsIdentifier);
  console.log("SFITLEGENDS in wallet", sfitLegendsNfts);

  // GYM1 BALANCE IN WALLET
  const { nfts: gym1Nfts, isLoadingNfts: isLoadingGym1Nfts, isErrorNfts: isErrorGym1Nfts }  = useGetUserNfts(connectedUserAddress, gymNftsInfo?.[0]?.token);
  console.log("GYM1 in wallet", gym1Nfts);

  // GYM NFTs STAKED
  const { userStakedInfo: stakedGymNfts, isLoadingUserStakedInfo: isLoadingStakedGymNfts, errorUserStakedInfo: isErrorStakedGymNfts }  = useGetUserStakedInfo(connectedUserAddress);
  console.log("GYM1 staked", stakedGymNfts);

  // GYM NFTs STAKED FULL VERSION
  const stakedNonces = stakedGymNfts?.map((obj) => {
    return obj.nonce;
  });
  let gym1Identifier:any = "";
  let gymNFTInfoLength:any = gymNftsInfo?.length != undefined
  
  if (!isLoadingGymNftsInfo && gymNFTInfoLength > 0) {
    gym1Identifier = gymNftsInfo?.[0]?.token;
  }
  const nftsInScArr: string[]|undefined = stakedNonces?.map((nonce) =>
    createIndentifierByCollectionAndNonce(gym1Identifier, nonce)
  );
  const { nfts: stakedGymNftsFullInfo, isLoading } = useGetNfts(nftsInScArr?.join(","));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let stakedGymNftsFinal = stakedGymNftsFullInfo;
  // After fetching stakedGymNftsFinal, add the desired attribute to its elements
  if (stakedGymNfts && stakedGymNftsFullInfo && !isLoading && !isLoadingStakedGymNfts) {
    const updatedStakedGymNftsFull = stakedGymNftsFullInfo.map((nftFull) => {
      // Find the corresponding object in stakedGymNfts based on the shared identifier (e.g., nonce)
      const matchingStakedNft = stakedGymNfts.find((nft) => nft.nonce === nftFull.nonce);

      const unbondingTimestamp = matchingStakedNft ? matchingStakedNft.unbondingTimestamp : 0;
      const timestampInSeconds = getCurrentTimestampInSeconds();
      let finalUnbondingTimestamp = 0;
      if (unbondingTimestamp > timestampInSeconds) {
        finalUnbondingTimestamp = unbondingTimestamp - timestampInSeconds;
      }

      return {
        ...nftFull,
        unbondedInSeconds: finalUnbondingTimestamp,
      };
    });
    stakedGymNftsFinal = updatedStakedGymNftsFull;
  }
  console.log("GYM1 staked FULL", stakedGymNftsFinal);

  useEffect(() => {
    const allGym1Nfts = stakedGymNftsFinal ? gym1Nfts.concat(stakedGymNftsFinal) : gym1Nfts;
    setAllGymNfts(allGym1Nfts);
  }, [gym1Nfts, stakedGymNftsFullInfo]);
  console.log("ALL GYM  NFTs", allGymNfts);

  console.log(" ");

  const unbondingDurationFinal = unbondingDuration?.seconds ? "Unstake can be done in around " + new Date(unbondingDuration?.seconds * 1000).toISOString().slice(11, 19) : "Stake it!"

  const sfitLegendsNftsLength = sfitLegendsNfts ? sfitLegendsNfts.length : 0;
  const gym1NftsLength = gym1Nfts ? gym1Nfts.length : 0;
  const stakedGymNftsLength = stakedGymNfts ? stakedGymNfts.length : 0;
  const allGymNftsLength = allGymNfts ? gymNftsLength : 0;

  const maxNonZeroValue = gymNfts.reduce((maxValue, nft) => {
    const unbondedInSeconds = nft.unbondedInSeconds;
    if (unbondedInSeconds !== 0 && unbondedInSeconds > maxValue) {
      return unbondedInSeconds;
    }
    return maxValue;
  }, 0);

  const canUnstakeAll = maxNonZeroValue === 0;
  const canStakeAll = gym1NftsLength === 0;

  useEffect(() => {
    if (gymNftsLength == 0 && !isLoadingGym1Nfts && activeTab == 0) {
      setGymNfts(gym1Nfts);
      setGymNftsLength(gym1NftsLength);
    }
  }, [activeTab, gym1Nfts, gym1NftsLength, gymNfts, gymNftsLength, isLoadingGym1Nfts]);

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);

    if (newValue === 0) {
      setGymNfts(gym1Nfts);
      setGymNftsLength(gym1NftsLength);
    } else if (newValue === 1) {
      setGymNfts(stakedGymNftsFinal);
      setGymNftsLength(stakedGymNftsLength);
    }
  };

  if (isLoadingTokensInfo || isLoadingSfitLegendsNfts || isLoadingGym1Nfts || isLoadingStakedGymNfts || isLoadingUnbondingDuration) {
    return (
      <Box
        sx={{
          mt: 20
        }}
      >
        <Typography align="center" variant="h1" color="common.white" gutterBottom>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
        <Box
          sx={{
            mt: 20
          }}
        >
          <Typography align="center" variant="h1" color="common.white" gutterBottom>
            Sense4FIT Metaverse Gym
          </Typography>
          <Typography align="center" variant="h3" color="#48eeed" gutterBottom>
            Get fit, earn rewards, and build your empire in the virtual world.
          </Typography>
        </Box>

        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Grid container spacing={2} sx={{ mb: 5 }}>
          {gyms.map((gym, key) => (
            <Grid key={key} xs item display="flex" justifyContent="center" alignItems="center">
              <Card className="gymTab" sx={{
                boxShadow: gym.status === "OPEN" ? '0px 0px 40px 5px #48EFEE' : '0px 0px 40px 5px #ff3f3f',
                opacity: gym.status === "OPEN" ? 1 : 0.5
              }}>
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
                          sx={{
                            fontWeight: 'bold'
                          }}
                          className="gymTitle"
                        >
                          {gym.name}
                        </Typography>
                        <Typography 
                          gutterBottom 
                          align="center" 
                          component="div"
                          className="gymSubTitle"
                        >
                          Metaverse Gym
                        </Typography>
                        <Typography 
                          variant="h6" 
                          align="center" 
                          color="common.white"
                          className='gymStatus'
                          sx={{
                            fontWeight: 'bold',
                            width: gym.status === "OPEN" ? '50%' : '100%'
                          }}
                        >
                          {gym.status  === "OPEN" ? "ENTER" : "COMING SOON"}
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
                          className="gymTitle"
                        >
                          {gym.name}
                        </Typography>
                        <Typography 
                          gutterBottom 
                          className="gymSubTitle"
                          align="center" 
                          component="div"
                        >
                          Metaverse Gym
                        </Typography>
                        <Typography 
                          variant="h6" 
                          align="center" 
                          color="common.white"
                          sx={{
                            fontWeight: 'bold',
                            width: gym.status === "OPEN" ? '50%' : '100%'
                          }}
                          className='gymStatus'
                        >
                          {gym.status === "OPEN" ? "ENTER" : "COMING SOON"}
                        </Typography>
                      </CardContent>
                  )
                }
              </Card>
            </Grid>
          ))}
          </Grid>  
        </Box>
        { 
          isLoggedIn ? 

        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Grid container spacing={2}>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
            <Grid xs={4}>
              <Typography 
                gutterBottom 
                className="gymTitle"
                align="center" 
                component="div"
              >
                SFIT LEGEND NFTs
              </Typography>
            </Grid>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
          </Grid>
        </Box>
        : null }

        { 
          isLoggedIn ? 
        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Accordion expanded={panel1} onChange={(e, expanded) => setPanel1(expanded)} className="nftAccordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon
                sx={{ color:"common.white", fontSize: 50, fontStyle: "bold" }}
              />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box sx={{ 
                flexGrow: 1,
                pr: 5
              }}
              >
                <Grid container spacing={2} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Grid xs={3}>
                    <Grid container>
                      <Grid container justifyContent="center" alignItems="center" xs={4}>
                        <NextImage
                              src={sfitLegendImage}
                              alt={"sfitLegendNFT"}
                              width={100}
                              height={100}
                              loading='lazy'
                              className={"nftImage nftAccordionImage"}
                            />
                      </Grid>
                      <Grid xs={1} className="vAlign">
                        <Typography  
                          variant="h4" 
                          sx={{ color: 'common.white'}}
                          whiteSpace={"nowrap"}
                        >
                          SFIT LEGEND
                        </Typography>  
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid px={5} className="vAlign" direction={"column"} justifyContent="center">
                      <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        Available
                      </Typography>  
                      <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        { sfitLegendsNftsLength }
                      </Typography>  
                  </Grid>
                  <Grid xs={4}>
                    <Grid container>
                      {
                        sfitLegendsNfts != undefined ?
                        sfitLegendsNfts.slice(0, 2).map((nft, key) => (
                          <Grid key={key} px={1} >
                            <NextImage
                              src={nft.url}
                              alt={"SFITLEGEND"}
                              width={100}
                              height={100}
                              className={"nftImage nftAccordionImage"}
                            />
                          </Grid>
                        )) : null
                      }
                      <Grid xs={3} className="vAlign">
                        { sfitLegendsNftsLength > 2 && <Typography  
                          variant="h4" 
                          sx={{ color: 'common.white'}}
                        >
                          +{sfitLegendsNftsLength - 2} more
                        </Typography>}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={2} className="vAlign" gap={4}>
                    {/* <Button variant="outlined" className="nftButton">Stake all</Button> */}
                    <a href="https://xoxno.com/collection/SFITLEGEND-5da9dd" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Button variant="outlined" className="actionButton" onClick={(e) => e.stopPropagation()} sx={{ ml: 2 }}>Buy</Button>
                    </a>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {sfitLegendsNfts.length > 0 ?
              <Grid container spacing={2}>     
                {
                  sfitLegendsNfts != undefined ?
                  sfitLegendsNfts.map((nft, key) => (
                    <Grid key={key} xs={3} my={2}>
                      <Card sx={{ maxWidth: 260, borderRadius: 2 }} className="nftCard">
                        <CardMedia
                          sx={{ height: 200, width: 200 }}
                          image={nft.url}
                          className="nftImage nftCardImage"
                        />
                        <CardContent sx={{ paddingTop: 3, display: 'flex', justifyContent: 'space-between', px: 4 }}>
                          <Typography  
                            sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                          >
                            {nft.name}
                          </Typography>
                          <Typography  
                            sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                          >
                            #{nft.nonce}
                          </Typography>
                        </CardContent>
                        {/* <CardActions>
                          <Button variant="contained" size="medium" className="nftCardButton" onClick={() => { stake(connectedUserAddress, nft.collection, nft.nonce) }}>Stake</Button>
                        </CardActions> */}
                      </Card>
                    </Grid>
                  )) : null
                }
              </Grid> :
              <Box className="warningBox" maxWidth={"500px"} flexDirection="column" display="flex" height="100%" justifyContent="center" alignItems="center">
                <Typography align="center" p={5} fontSize={"18px"}>
                  IN ORDER TO PARTICIPATE, YOU NEED TO HAVE AT LEAST ONE SFITLEGEND NFT.
                </Typography>
                <Box width={"150px"} display="flex" justifyContent="center" alignItems="center" my={1}>
                  <a href="https://xoxno.com/collection/SFITLEGEND-5da9dd" target="_blank" rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      width: "150px",
                      justifyContent: 'center',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                    <Button variant="outlined" className="buyButton">Buy NFT</Button>
                  </a>
                </Box>
              </Box>
              }
            </AccordionDetails>
          </Accordion>
        </Box>

        : null }
        { 
        isLoggedIn ? 
        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Grid container spacing={2} style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
            <Grid xs={4} direction={"column"}>
              <Typography 
                gutterBottom 
                className="gymTitle"
                align="center" 
                component="div"
              >
                GYM NFTs
              </Typography>
            </Grid>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
          </Grid>
        </Box>
        : null }
        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ "& .MuiTabs-indicator": { height: 4, backgroundColor: '#48eeed'} }}>
          <Tab label="Stakeable" id="tab-0" className="gymSubTitle"/>
          <Tab label="Staked" id="tab-1" className="gymSubTitle"/>
        </Tabs>
        <TabPanel value={activeTab} index={0}>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
        </TabPanel>
        { 
        isLoggedIn ? 
        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Accordion expanded={panel2} onChange={(e, expanded) => setPanel2(expanded)} className="nftAccordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color:"common.white", fontSize: 50, fontStyle: "bold" }} />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Box sx={{ 
                flexGrow: 1,
                pr: 5
              }}>
                <Grid container spacing={2} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Grid xs={3}>
                    <Grid container style={{
                      display: 'flex',
                      justifyContent: 'left',
                      alignContent: "center"
                    }}>
                      <Grid container justifyContent="center" alignItems="center" xs={4}>
                        <NextImage
                          src={gymPiperaImage}
                          alt={"Pipera GYM"}
                          width={150}
                          height={150}
                          className={"nftImage nftAccordionImage"}
                        />
                      </Grid>
                      <Grid xs={6} className="vAlign">
                        <Grid container>
                          <Grid xs={12}>
                            <Typography  
                            className="gymTitle" 
                            sx={{ color: 'common.white'}}
                          >
                            PIPERA
                          </Typography>  
                          </Grid>
                          <Grid xs={12}>
                          <Typography  
                            variant="h6" 
                            sx={{ color: 'common.white'}}
                          >
                            METAVERSE GYM
                          </Typography> 
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid px={5} className="vAlign" direction={"column"} justifyContent="center">
                    <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        Available
                      </Typography>  
                      <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        { gymNftsLength }
                      </Typography>
                  </Grid>
                  <Grid px={5}>
                    <Grid container>
                    {
                        gymNfts != undefined ?
                        gymNfts.slice(0, 2).map((nft, key) => (
                          <Grid key={key} px={0.5}>
                            <NextImage
                              src={gymNfts?.[0].media[0].thumbnailUrl}
                              alt={gymNfts?.[0].name}
                              width={100}
                              height={100}
                              className={"nftImage nftAccordionImage"}
                            />
                          </Grid>
                        )) : null
                      }
                        <Grid xs={3} className="vAlign">
                          { gymNftsLength > 2 && <Typography  
                            variant="h4" 
                            sx={{ color: 'common.white'}}
                          >
                            +{gymNftsLength - 2} more
                          </Typography>}
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={2} className="vAlign" gap={4}>
                    {activeTab == 0 ?
                      <Tooltip
                        title={gym1NftsLength > 0 ? null : "No NFTs available to stake."}
                      >
                        <Button
                          variant="outlined"
                          className={gym1NftsLength > 0 ? "actionButton" : "actionButtonDisabled"}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle the click event for the "Stake all" button here
                          }}
                        >
                          Stake all
                        </Button>
                      </Tooltip>
                    :
                    <Tooltip
                    title={canUnstakeAll ? null
                      : `${getTimeString(maxNonZeroValue, "left for unbonding.")}`}
                    >
                      <Button variant="outlined"
                        className={canUnstakeAll ? "actionButton" : "actionButtonDisabled"}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Unstake all
                      </Button>
                    </Tooltip>
                    }
                    <a href="https://xoxno.com/collection/SFITLEGEND-5da9dd" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Button variant="outlined" className="actionButton" onClick={(e) => e.stopPropagation()} sx={{ ml: 2 }}>Buy</Button>
                    </a>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {gym1NftsLength + stakedGymNftsLength > 0 ? 
              <Grid container spacing={2}>
                {
                  gymNfts != undefined ?
                  gymNfts.map((nft, key) => (
                    <Grid key={key} xs={3} mb={2}>
                      <Card sx={{ maxWidth: 260 }} className="nftCard">
                          {nft.media && <CardMedia
                            sx={{ height: 200, width: 200 }}
                            image={nft.media[0].thumbnailUrl}
                            className="nftImage nftCardImage"
                          />}
                        <CardContent sx={{ paddingTop: 3, display: 'flex', justifyContent: 'space-between', px: 4 }}>
                              <Typography  
                                sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                              >
                                {nft.name}
                              </Typography>
                              <Typography  
                                sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                              >
                                #{nft.nonce}
                              </Typography>
                        </CardContent>
                        <CardActions>
                          {
                            nft.unbondedInSeconds >= 0 ? 
                            <Tooltip
                            title={nft.unbondedInSeconds == 0 ? null
                              : `${getTimeString(nft.unbondedInSeconds, "left for unbonding the NFT.")}`}
                            >
                              <Button
                                variant="contained"
                                style={{
                                  opacity: 5
                                }}
                                size="medium"
                                className={nft.unbondedInSeconds > 0 ? "nftCardButtonDisabled" : "nftCardButton"}
                                onClick={() => {
                                  if (nft.unbondedInSeconds == 0) {
                                    unstake(connectedUserAddress, nft.collection, nft.nonce);
                                  }
                                }}
                              >
                              Unstake
                            </Button>
                          </Tooltip>
                            :
                            <Button variant="contained" size="medium" className="nftCardButton" onClick={() => { stake(connectedUserAddress, nft.collection, nft.nonce) }}>Stake</Button>
                          }
                          
                        </CardActions>
                      </Card>
                    </Grid>
                  )) : null
                }
                
              </Grid> :
              <Box className="warningBox" maxWidth={"500px"} flexDirection="column" display="flex" height="100%" justifyContent="center" alignItems="center">
                <Typography align="center" p={5} fontSize={"18px"}>
                  IN ORDER TO PARTICIPATE, YOU NEED TO HAVE AT LEAST ONE GYM NFT.
                </Typography>
                <Box width={"150px"} display="flex" justifyContent="center" alignItems="center" my={1}>
                <a href="https://xoxno.com/collection/SFITLEGEND-5da9dd" target="_blank" rel="noopener noreferrer" 
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: "150px",
                    justifyContent: 'center',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>
                  <Button variant="outlined" className="buyButton">Buy NFT</Button>
                </a>
                </Box>
              </Box>            
              }
            </AccordionDetails>
          </Accordion>
        </Box>

        : null }
        { 
        !isLoggedIn ? 
        <Typography align="center" variant="h3" color="#48eeed" gutterBottom mt={8}>
          Connect with your wallet to see your NFTs.
        </Typography>
      : null
      }
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
