import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {address, signature, expiresAt} = req.body

  try {
    

    res.status(200).json({ success: true });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}