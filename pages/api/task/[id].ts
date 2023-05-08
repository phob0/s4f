import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskID = req.query.id
  const userID = req.body.userID
  const status = (req.body.status === "NEW" ? "STARTED" : req.body.status === "STARTED" ? "FINISHED" : "NEW")
  // TODO rewrite this
  await prisma.tasksOnUsers.upsert({
    where: {
      userID_taskID: {
        userID: Number(userID),
        taskID: Number(taskID)
      }
    },
    update: {
      status: (status === "NEW" ? "STARTED" : status === "STARTED" ? "FINISHED" : "NEW")
    },
    create: {
      userID: Number(userID),
      taskID: Number(taskID),
      status: (status === "NEW" ? "STARTED" : status === "STARTED" ? "FINISHED" : "NEW")
    },
  })

  // const task = await prisma.task.update({
  //   where: { id: Number(taskID) },
  //   data: {
  //     status: (status === "NEW" ? "STARTED" : status === "STARTED" ? "FINISHED" : "NEW")
  //   }
  // })

  res.status(200).json({ message: 'Task updated' })
}