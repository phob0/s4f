import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'

interface Task {
  task: {
    id: number
    name: string
    description: string
    status: string
  }
}

const Task:NextPage<Task> = ({ task }) =>  {

  function handleColorStatus(status: string) {
    return status === "NEW" ? "green" : status === "STARTED" ? "yellow" : "red"
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 5
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          { task.name }
        </Typography>
        <Typography variant="h3" color={ handleColorStatus(task.status) } gutterBottom>
          { task.status }
        </Typography>
      </Box>

      <Box sx={{ 
          flexGrow: 1,
          mt: 20,
          px: 30
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography 
              gutterBottom 
              variant="body1" 
              component="div"
            >
              { task.description }  
            </Typography>
          </CardContent>
          <CardActions style={{justifyContent: 'center'}}>
              <Button variant="contained" color="secondary">
                Start
              </Button>
          </CardActions>
        </Card>
      </Box>

    </Container>
  )
}

export default Task

export const getServerSideProps: GetServerSideProps = async (context) => {
  // READ all Tasks from gym from DB
  const id = context.query.id

  const task = await prisma?.task.findFirst({
    where: {
      id: id,
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
      task
    }
  }
}