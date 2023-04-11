import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskID = req.query.id
  const {status, id} = req.body
    
  const task = await prisma.task.update({
    where: { id: Number(taskID) },
    data: {
      status: (status === "NEW" ? "STARTED" : status === "STARTED" ? "FINISHED" : "NEW")
    }
  })
  res.status(200).json({ message: 'Task updated' }
}