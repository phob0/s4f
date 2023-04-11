import Image from 'next/image'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export default function Home() {
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
                      PIPERA
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
                      OPEN
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                <CardActionArea href="#">
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      align="center" 
                      component="div"
                      sx={{fontWeight: 'bold'}}
                    >
                      PIPERA
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
                      OPEN
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                <CardActionArea href="#">
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      align="center" 
                      component="div"
                      sx={{fontWeight: 'bold'}}
                    >
                      PIPERA
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
                      color="red"
                      sx={{fontWeight: 'bold'}}
                    >
                      COMMING SOON
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                <CardActionArea href="#">
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      align="center" 
                      component="div"
                      sx={{fontWeight: 'bold'}}
                    >
                      PIPERA
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
                      color="red"
                      sx={{fontWeight: 'bold'}}
                    >
                      COMMING SOON
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs display="flex" justifyContent="center" alignItems="center">
              <Card sx={{ width: 250 }}>
                <CardActionArea href="#">
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      align="center" 
                      component="div"
                      sx={{fontWeight: 'bold'}}
                    >
                      PIPERA
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
                      color="red"
                      sx={{fontWeight: 'bold'}}
                    >
                      COMMING SOON
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>  
        </Box>
    </Container>
  )
}