import Link from 'next/link'
import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import { purple } from '@mui/material/colors';
import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetCanUserCompleteTasks, useGetTokensInfo, useGetTotalClaimed, useGetUserClaimable } from '@/utils/services/hooks';
import { claim, completeTasks } from '@/utils/services/calls';
import { Button } from '@mui/material';
// import { useGetTotalClaimed } from '@/utils/hooks/hooks';

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
  const connectedUserAddress = accountInfo.address;

  // QUERIES
  // const { tokensInfo, isLoadingTokensInfo, errorTokensInfo} = useGetTokensInfo();
  // const { totalClaimed, isLoadingTotalClaimed, errorTotalClaimed} = useGetTotalClaimed(connectedUserAddress);
  // const { canCompleteTasks, isLoadingCanCompleteTasks, errorCanCompleteTasks} = useGetCanUserCompleteTasks(connectedUserAddress);
  // const { userClaimable, isLoadingUserClaimable, errorUserClaimable} = useGetUserClaimable(connectedUserAddress);

  // CALLS
  // completeTasks(connectedUserAddress)
  // claim(connectedUserAddress, "KFBLERS-fb3bac", 5)

  // console.log("LOG: ", tx_res);

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
