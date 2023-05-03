import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {address, signature, expiresAt} = req.body

  const user = await prisma.user.upsert({
    where: {
      address: address
    },
    update: {
      signature: signature,
      expiresAt: expiresAt
    },
    create: {
      address: address,
      signature: signature,
      expiresAt: expiresAt
    },
  })
    

  res.status(200).json({ success: true, user: user });
 
}