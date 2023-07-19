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
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { purple } from '@mui/material/colors';
import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetCanUserCompleteTasks, useGetTokensInfo, useGetTotalClaimed, useGetUserClaimable } from '@/utils/services/hooks';
import { claim, completeTasks } from '@/utils/services/calls';
import { Button } from '@mui/material';
// import { useGetTotalClaimed } from '@/utils/hooks/hooks';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import React, { useState } from 'react';

// Array interface
interface Gym {
  gyms: {
    id: number
    name: string
    status: string
  }[]
}

const Home: NextPage<Gym> = ({ gyms }) =>  {

  const { isLoggedIn } = useGetLoginInfo();
  const accountInfo = useGetAccount();

  const [panel1, setPanel1] = useState(true);
  const [panel2, setPanel2] = useState(true);
  
  // const connectedUserAddress = accountInfo.address;

  // QUERIES
  // const { tokensInfo, isLoadingTokensInfo, errorTokensInfo} = useGetTokensInfo();
  // const { totalClaimed, isLoadingTotalClaimed, errorTotalClaimed} = useGetTotalClaimed(connectedUserAddress);
  // const { canCompleteTasks, isLoadingCanCompleteTasks, errorCanCompleteTasks} = useGetCanUserCompleteTasks(connectedUserAddress);
  // const { userClaimable, isLoadingUserClaimable, errorUserClaimable} = useGetUserClaimable(connectedUserAddress);

  // CALLS
  // completeTasks(connectedUserAddress)
  // const nft_token = tokensInfo[1].token;
  // const nft_nonce = 1; // any numbers based on user's balance
  // claim(connectedUserAddress, nft_token, nft_nonce);

  // console.log("LOG: ");

  function handleColorAvailability(status: string) {
    return status === "OPEN" ? "green" : "red"
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
                SFIT LEGEND
              </Typography>
            </Grid>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ 
            flexGrow: 1,
            mt: 15
          }}
        >
          <Accordion expanded={panel1} onChange={(e, expanded) => setPanel1(expanded)} className="nftAccordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color:"common.white", fontSize: 50, fontStyle: "bold" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box sx={{ 
                flexGrow: 1
              }}>
                <Grid container spacing={2}>
                  <Grid xs={3}>
                    <Grid container>
                      <Grid xs={6}>
                        <Image
                          src="/demo_imgs/1nft.jpg"
                          width={100}
                          height={100}
                          alt="Picture of the author"
                          className="nftImage nftAccordionImage"
                        />  
                      </Grid>
                      <Grid xs={6} className="vAlign">
                        <Typography  
                          variant="h4" 
                          sx={{ color: 'common.white'}}
                        >
                          SFITLEGEND
                        </Typography>  
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={2} className="vAlign">
                      <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        4
                      </Typography>  
                  </Grid>
                  <Grid xs={5}>
                    <Grid container>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/2nft.jpg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/3nft.jpg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/4nft.jpg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3} className="vAlign">
                      <Typography  
                            variant="h4" 
                            sx={{ color: 'common.white'}}
                          >
                            +1 more
                          </Typography> 
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={2} className="vAlign">
                    <Button variant="outlined" className="nftButton">Stake all</Button>
                    <Button variant="outlined" className="nftButton" sx={{ ml: 2 }}>Buy</Button>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Grid container spacing={2}>
                  <Grid xs={3}>
                    <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/5nft.jpg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/5nft.jpg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/5nft.jpg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/5nft.jpg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
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
                GYM NFTs
              </Typography>
            </Grid>
            <Grid xs={4} sx={{ position: "relative" }}>
              <div className="breakLine" />
            </Grid>
          </Grid>
        </Box>
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
                flexGrow: 1
              }}>
                <Grid container spacing={2}>
                  <Grid xs={3}>
                    <Grid container>
                      <Grid xs={6}>
                        <Image
                          src="/demo_imgs/gym_nft.jpeg"
                          width={100}
                          height={100}
                          alt="Picture of the author"
                          className="nftImage nftAccordionImage"
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
                  <Grid xs={2} className="vAlign">
                      <Typography  
                        variant="h4"
                        align="center"
                        sx={{ color: 'common.white', width: '100%'}}
                      >
                        4
                      </Typography>  
                  </Grid>
                  <Grid xs={5}>
                    <Grid container>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/gym_nft.jpeg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/gym_nft.jpeg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3}>
                      <Image
                        src="/demo_imgs/gym_nft.jpeg"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        className="nftImage"
                      />
                      </Grid>
                      <Grid xs={3} className="vAlign">
                      <Typography  
                            variant="h4" 
                            sx={{ color: 'common.white'}}
                          >
                            +1 more
                          </Typography> 
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={2} className="vAlign">
                    <Button variant="outlined" className="nftButton">Stake all</Button>
                    <Button variant="outlined" className="nftButton" sx={{ ml: 2 }}>Buy</Button>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Grid container spacing={2}>
                  <Grid xs={3}>
                    <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/gym_nft.jpeg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/gym_nft.jpeg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/gym_nft.jpeg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid xs={3}>
                  <Card sx={{ maxWidth: 260 }} className="nftCard">
                      <CardMedia
                        sx={{ height: 200, width: 200 }}
                        image="/demo_imgs/gym_nft.jpeg"
                        className="nftImage nftCardImage"
                      />
                      <CardContent sx={{ paddingTop: 3 }}>
                        <Grid container spacing={2}>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              SFITLEGEND
                            </Typography>
                          </Grid>
                          <Grid xs={6} sx={{ textAlign: 'center' }}>
                            <Typography  
                              sx={{ display: 'inline-block', color: 'common.white', fontSize: 13  }}
                            >
                              #2002
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button variant="contained" size="medium" className="nftCardButton">Stake</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>  
              </Box>
            </AccordionDetails>
          </Accordion>
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
