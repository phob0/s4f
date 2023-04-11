import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskId = req.query.id
  const {status, id} = req.body
    
  const note = await prisma.task.update({
    where: { id: Number(noteId) },
    data: {
      title,
      content
    }
  })
  res.status(200).json({ message: 'Note updated' }
}