import Link from 'next/link'
import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import { claim, completeTasks, stake, stakeMulti, unstake, unstakeMulti } from '@/utils/services/calls';
import { Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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
import LoginModalButton from '@/components/tools/LoginModal';

import { useAxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext';
import { useSelector } from '@multiversx/sdk-dapp/reduxStore/DappProviderContext';
import { isLoggedInSelector, loginInfoSelector } from '@multiversx/sdk-dapp/reduxStore/selectors';
import { isMobile } from '@/utils/isMobile';

const gymPiperaImage = '/demo_imgs/gym_nft_cut.jpeg';
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

const splitNftName = (nftName: string) => {
  const splitParts = nftName.split(' ');
  const firstPart = splitParts.slice(0, -1).join(' ');
  const secondPart = splitParts[splitParts.length - 1];
  
  return [firstPart, secondPart];
}

const theme = createTheme({
  typography: {
    fontFamily: 'Oswald, Roboto, sans-serif',
  },
});
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#48eeed',
//     },
//     secondary: {
//       main: '#ff3f3f',
//     },
//     // ...other color properties
//   },
//   typography: {
//     fontFamily: 'Oswald, Roboto, sans-serif',
//   },
//   // ...other theme properties
// });
const Home: NextPage<Gym> = ({ gyms }) =>  {

  const { isLoggedIn } = useGetLoginInfo();
  const accountInfo = useGetAccount();

  const [panel1, setPanel1] = useState(false);
  const [panel2, setPanel2] = useState(false);
  // const [allGymNfts, setAllGymNfts] = useState<any[]>([]);
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

  // console.log(" ");

  // SFITLEGENDS BALANCE IN WALLET
  const { nfts: sfitLegendsNfts, isLoadingNfts: isLoadingSfitLegendsNfts, isErrorNfts: isErrorSfitLegendsNfts }  = useGetUserNfts(connectedUserAddress, sfitLegendsNftsIdentifier);
  // console.log("SFITLEGENDS in wallet", sfitLegendsNfts);

  // GYM1 BALANCE IN WALLET
  const { nfts: gym1Nfts, isLoadingNfts: isLoadingGym1Nfts, isErrorNfts: isErrorGym1Nfts }  = useGetUserNfts(connectedUserAddress, gymNftsInfo?.[0]?.token);
  // console.log("GYM1 in wallet", gym1Nfts);

  // GYM NFTs STAKED
  const { userStakedInfo: stakedGymNfts, isLoadingUserStakedInfo: isLoadingStakedGymNfts, errorUserStakedInfo: isErrorStakedGymNfts }  = useGetUserStakedInfo(connectedUserAddress);
  // console.log("GYM1 staked", stakedGymNfts);

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
    const updatedStakedGymNftsFull = stakedGymNftsFullInfo.map((nftFull: { nonce: number; }) => {
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
  // console.log("GYM1 staked FULL", stakedGymNftsFinal);

  // console.log(" ");

  const unbondingDurationFinal = unbondingDuration?.seconds ? "Unstake can be done in around " + new Date(unbondingDuration?.seconds * 1000).toISOString().slice(11, 19) : "Stake it!"

  const sfitLegendsNftsLength = sfitLegendsNfts ? sfitLegendsNfts.length : 0;
  const gym1NftsLength = gym1Nfts ? gym1Nfts.length : 0;
  const stakedGymNftsLength = stakedGymNfts ? stakedGymNfts.length : 0;
  const isEligible = sfitLegendsNftsLength > 0 && (gym1NftsLength > 0 || stakedGymNftsLength > 0);

  const maxNonZeroValue = gymNfts.reduce((maxValue, nft) => {
    const unbondedInSeconds = nft.unbondedInSeconds;
    if (unbondedInSeconds !== 0 && unbondedInSeconds > maxValue) {
      return unbondedInSeconds;
    }
    return maxValue;
  }, 0);

  const canUnstakeAll = maxNonZeroValue === 0 && stakedGymNftsLength > 0;

  useEffect(() => {
    if (!isLoadingGym1Nfts && activeTab == 0) {
      setGymNfts(gym1Nfts);
      setGymNftsLength(gym1NftsLength);
    }
  }, [activeTab, gym1Nfts, gym1NftsLength, gymNfts, gymNftsLength, isLoadingGym1Nfts]);

  const handleTabChange = (_event: any, newValue: number) => {
    setActiveTab(newValue);

    if (newValue === 0) {
      setGymNfts(gym1Nfts);
      setGymNftsLength(gym1NftsLength);
    } else if (newValue === 1) {
      const finalStake =  stakedGymNftsFinal != undefined ? stakedGymNftsFinal : []
      setGymNfts(finalStake);
      setGymNftsLength(stakedGymNftsLength);
    }
  };

  const isMobileDevice = isMobile();

  return (
    <ThemeProvider theme={theme}>
      {!isMobileDevice ?
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
                  gym.status === "OPEN" && isLoggedIn && isEligible ? (
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
                      <Grid container justifyContent="center" alignItems="center">
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
                            pb={2}
                          >
                            METAVERSE GYM
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
                            {gym.status  === "OPEN" ? "LIVE" : "COMING SOON"}
                            
                          </Typography>
                        </CardContent>
                        <Grid
                          className={"eligibleButton"}
                          position={"absolute"}
                          top={778}>
                          <Typography fontSize={"14px"} color={"black"} align='center'>
                            You are eligible
                          </Typography>
                        </Grid>
                      </Grid>
                    </Link>
                  ) : (
                    <Grid container justifyContent="center" alignItems="center">
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
                          pb={2}
                        >
                          METAVERSE GYM
                        </Typography>
                        {gym.status === "OPEN" ? 
                        <Grid container justifyContent="center" alignItems="center">
                          <LoginModalButton showButton={"LIVE"}/>
                        </Grid> 
                        :
                        <Typography 
                          variant="h6" 
                          align="center" 
                          color="common.white"
                          sx={{
                            fontWeight: 'bold',
                            width: '100%',
                          }}
                          className='gymStatus'
                        >
                          COMING SOON
                        </Typography>}
                      </CardContent>
                      <Grid
                        className={
                          gym.status === "OPEN" && isLoggedIn ? "notEligibleButton" : "eligibleButtonHidden"
                        }
                        position={"absolute"}
                        top={778}>
                        <Typography fontSize={"14px"} color={"black"} align='center'>
                          You are not eligible
                        </Typography>
                      </Grid>
                    </Grid>
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
          <Grid container spacing={2} >
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
            <Grid xs={4}>
              <Typography 
                gutterBottom 
                className="sectionTitle"
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
          <Accordion expanded={panel1} onChange={(_e, expanded) => setPanel1(expanded)} className="nftAccordion">
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
                    <Grid container style={{
                      display: 'flex',
                      justifyContent: 'left',
                      alignContent: "center"
                    }}>
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
                  <Grid>
                    <Grid container flexDirection={"column"} px={5} className="vAlign" py={1}>
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
                        {sfitLegendsNftsLength}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid xs={3}>
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
                  <Grid xs={1} className="vAlign" gap={4}>
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
                          className="nftImageNoGlow nftCardImage"
                        />
                        <CardContent sx={{ paddingTop: 3, display: 'flex', justifyContent: 'space-between', px: 4 }}>
                          <Typography  
                            sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                          >
                            {splitNftName(nft.name)[0]}
                          </Typography>
                          <Typography  
                            sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                          >
                            {splitNftName(nft.name)[1]}
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
          }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={4} sx={{ position: "relative", textAlign: "center" }}>
                <div className="breakLine" />
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography 
                  gutterBottom 
                  className="sectionTitle"
                  variant="h5"
                  component="div"
                >
                  GYM NFTs
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ position: "relative", textAlign: "center" }}>
                <div className="breakLine" />
              </Grid>
            </Grid>
          </Box>
        : null }
        { isLoggedIn ?
          (<Grid  container justifyContent="center" alignItems="center">
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ "& .MuiTabs-indicator": { height: 4, backgroundColor: '#48ecec' } }}>
          <Tab label="Stakeable" id="tab-0" className="stakeableStakedTabs" />
          <Tab label="Staked" id="tab-1" className="stakeableStakedTabs" />
          </Tabs>
          </Grid>) : null
        }
        { 
        isLoggedIn ? 
        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Accordion expanded={panel2} onChange={(_e, expanded) => setPanel2(expanded)} className="nftAccordion">
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
                    <Grid container justifyContent="left" alignItems="center">
                      <Grid container justifyContent="center" alignItems="center" xs={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Your image component */}
                        <NextImage
                          src={gymPiperaImage}
                          alt={"Pipera GYM"}
                          width={190}
                          height={190}
                          className={"nftImage nftAccordionImage"}
                        />
                      </Grid>
                      <Grid item xs={6} className="vAlign">
                        <Grid container flexDirection="column" justifyContent="center" alignItems="left">
                          <Typography className="gymTitle" sx={{ color: 'common.white' }}>
                            PIPERA
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'common.white' }}>
                            METAVERSE GYM
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid>
                    <Grid container flexDirection={"column"} px={5} className="vAlign" py={1}>
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
                        {gymNftsLength}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid xs={2}>
                    <Grid container>
                    {
                        gymNfts != undefined ?
                        gymNfts.slice(0, 2).map((_nft, key) => (
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
                    <div className="tooltip-container">
                      <Button
                        variant="outlined"
                        className={gymNftsLength > 0 ? "actionButton" : "actionButtonDisabled"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (gymNftsLength > 0) {
                            const nftIds = gymNfts.map((nft, _key) => {
                              return nft.collection;
                            });
                            const nftNonces = gymNfts.map((nft, _key) => {
                              return nft.nonce;
                            });
                            stakeMulti(connectedUserAddress, nftIds, nftNonces);
                          }
                        }}
                      >
                        Stake all
                      </Button>
                      {gym1NftsLength === 0 && (
                        <div className="tooltip-content">
                          No NFTs available to stake.
                        </div>
                      )}
                    </div>
                    :
                    <div className="tooltip-container">
                      <Button
                        variant="outlined"
                        className={canUnstakeAll ? "actionButton" : "actionButtonDisabled"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canUnstakeAll) {
                            const nftIds = stakedGymNfts.map((nft, _key) => {
                              return nft.token
                            });
                            const nftNonces = stakedGymNfts.map((nft, _key) => {
                              return nft.nonce
                            });
                            unstakeMulti(connectedUserAddress, nftIds[0], nftNonces);
                          }
                        }}
                        sx={{ minWidth: '150px' }} // Set the minimum width for the button
                      >
                        Unstake all
                      </Button>
                      {canUnstakeAll ? null : (
                        <div className="tooltip-content">
                          {stakedGymNftsLength > 0 && maxNonZeroValue
                            ? `${getTimeString(maxNonZeroValue, "left for unbonding.")}`
                            : "No NFTs available to unstake."}
                        </div>
                      )}
                    </div>
                    }
                    <a href="https://xoxno.com/collection/FVGYM1-94fff1" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                            className="nftImageNoGlow nftCardImage"
                          />}
                        <CardContent sx={{ paddingTop: 3, display: 'flex', justifyContent: 'space-between', px: 4 }}>
                              <Typography  
                                sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                              >
                                {splitNftName(nft.name)[0]}
                              </Typography>
                              <Typography  
                                sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                              >
                                {splitNftName(nft.name)[1]}
                              </Typography>
                        </CardContent>
                        <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CardActions>
                            {nft.unbondedInSeconds >= 0 ? (
                              <>
                                <Button
                                  variant="contained"
                                  size="medium"
                                  className={nft.unbondedInSeconds > 0 ? "nftCardButtonDisabled" : "nftCardButton"}
                                  onClick={() => {
                                    if (nft.unbondedInSeconds === 0) {
                                      unstake(connectedUserAddress, nft.collection, nft.nonce);
                                    }
                                  }}
                                  sx={{ minWidth: '150px' }} // Set the minimum width for the button
                                >
                                  Unstake
                                </Button>
                                {nft.unbondedInSeconds === 0 ? null : (
                                  <div className="tooltip-content">
                                    {getTimeString(nft.unbondedInSeconds, "left for unbonding the NFT.")}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Button variant="contained" size="medium" className="nftCardButton" onClick={() => { stake(connectedUserAddress, nft.collection, nft.nonce) }}>
                                Stake
                              </Button>
                            )}
                        </CardActions>
                      </div>
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
                <a href="https://xoxno.com/collection/FVGYM1-94fff1" target="_blank" rel="noopener noreferrer" 
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
      </Container> :
      <Box
        width={"full"}
        height={"40vh"}
        display="flex"
        justifyContent="center"
        py={10}
        px={10}
        fontSize={"20px"}
        flexDirection={"column"}
        gap={5}
      >
        <Box>
          The mobile version of the website is currently under development.
        </Box>
        <Box>
          Please visit the website from a desktop browser.
        </Box>
      </Box>
      }
    </ThemeProvider>
  )
}

export default Home

// Server side rendering on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // READ all gyms from DB
  const gyms = await prisma?.gym.findMany({
    select: {
      name: true,
      address: true,
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
