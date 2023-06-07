import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userID = req.body.userID

  const reward = await prisma.reward.create({
    data: {
      userID: userID
    }
  })

  res.status(200).json({ message: 'Reward created' })
}