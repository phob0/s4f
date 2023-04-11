import React from 'react';
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
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'

function generate(element: React.ReactElement) {
  return [0, 1, 2, 3, 4, 5, 6].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

interface GymID {
  gymID: {
    id: string
  }
}

interface Task {
  tasks: {
    id: string
    name: string
    description: string
    status: string
  }[]
}

const Tasks:NextPage<Task> = ({ tasks }) => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 5
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          Welcome to your gym!
        </Typography>
        <Typography variant="h3" color="error" gutterBottom>
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
            <Grid container spacing={2}>
            {tasks.map((task, key) => (
              <Grid key={key} item xs display="flex" justifyContent="center" alignItems="center">
                <Card sx={{ width: 250 }}>
                  <CardContent>
                    <Link href={{
                        pathname: '/task',
                        query: { task: task.id } 
                      }}
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
                      <Button variant="contained" color="secondary">
                        Start
                      </Button>
                  </CardActions>
                  {/* <CardActions style={{justifyContent: 'center'}}>
                      <Alert variant="filled" severity="success">Task is done</Alert>
                  </CardActions> */}
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


export const getServerSideProps: GetServerSideProps = async (context) => {
  // READ all Tasks from gym from DB
  const id = context.query.gym

  const tasks = await prisma?.task.findMany({
    where: {
      gymID: parseInt(id),
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    }
  })

  return {
    props: {
      tasks
    }
  }
}
