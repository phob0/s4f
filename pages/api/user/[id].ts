import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

interface TasksUsers {
  userID: number,
  taskID: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userID = req.query.id

  const user = await prisma.user.findUnique({
    where: { id: Number(userID) },
    include: { tasks: true }
  })

  const tasks = await prisma.task.findMany()

  let tasksUser:Array<TasksUsers> = []

  tasks.forEach(function (value) {
    tasksUser.push({
      userID: Number(user?.id),
      taskID: value.id
    })
  })

  // console.log(user)

  // // const tasksOnUsers = await prisma.tasksOnUsers.createMany({
  // //   data: tasksUser
  // // })

  res.status(200).json({ user: user })
}