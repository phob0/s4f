import type { NextPage } from 'next'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { prisma } from '../lib/prisma'
import { GetServerSideProps } from 'next'
import { purple } from '@mui/material/colors';

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
    return status === "NEW" ? "red" : status === "STARTED" ? "yellow" : "green"
  }

  const TaskButtonStatus = (props: Task) => {
    const status = props.status
  
    if (status === "NEW") {
      return <Button variant="contained" color="secondary" onClick={() => updateTaskStatus(props)}>
              Start
            </Button>
    } else if (status === "STARTED") {
      return <Button variant="contained" color="error" onClick={() => updateTaskStatus(props)}>
              End Task
            </Button>
    } else {
      return <Alert variant="filled" severity="success">Task is done</Alert>
    }
  }

  const updateTaskStatus = async (task: Task) => {
    fetch(`api/task/${task.id}`, {
      body: JSON.stringify({
        id: task.id,
        status: task.status
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT'
    }).then(() => {
      refreshData()
    })
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h1" color={purple['A400']} gutterBottom>
          { task.name }
        </Typography>
        <Typography variant="h3" color={ handleColorStatus(task.status) } gutterBottom>
          { task.status }
        </Typography>
      </Box>

      <Box sx={{ 
          flexGrow: 1,
          mt: 10,
          mb: 5,
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
            {TaskButtonStatus(task)}
          </CardActions>
        </Card>
      </Box>

    </Container>
  )
}

export default Task

export const getServerSideProps: GetServerSideProps = async (context) => {
  // READ all Tasks from gym from DB
  const id = Number(context.query.id)

  const task = await prisma?.task.findUnique({
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