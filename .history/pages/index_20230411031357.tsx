import Image from 'next/image'
import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'

// Array interface
interface Gym {
  gyms: {
    id: string
    name: string
    status: string
  }[]
}

const Home: NextPage<Gym> = ({ gyms }) =>  {
  console.log(gyms)
  return (
    <Container maxWidth="xl">
        <Box
          sx={{
            mt: 25
          }}
        >
          <Typography variant="h1" color="primary" gutterBottom>
            Sense4FIT Metaverse Gym
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            Get fit, earn rewards, and build your empire in the virtual world.
          </Typography>
        </Box>

        <Box sx={{ 
            flexGrow: 1,
            mt: 20
          }}
        >
          <Grid container spacing={2}>
          {gyms.map((gym) => (
            <Grid item xs display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                <CardActionArea href="/gym">
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
                      color="green"
                      sx={{fontWeight: 'bold'}}
                    >
                      {gym.status}
                    </Typography>
                  </CardContent>
                </CardActionArea>
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