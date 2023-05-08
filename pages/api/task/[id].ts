import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskID = req.query.id
  const userID = req.body.userID
  const status = (req.body.status === "NEW" ? "STARTED" : req.body.status === "STARTED" ? "FINISHED" : "NEW")

  let task = await prisma.tasksOnUsers.findFirst({
    where: {
      userID: Number(userID),
      taskID: Number(taskID)
    }
  })

  await prisma.tasksOnUsers.update({
    where: {
      id: Number(task?.id)
    },
    data: {
      status: status
    }
  })

  res.status(200).json({ message: 'Task updated' })
}