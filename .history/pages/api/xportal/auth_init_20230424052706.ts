import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {email} = req.body

  try {
    const response = await fetch('https://devnet-launch-api.xportal.com/hello', {
      method: 'GET'
    });
    const data = await response.json();

    console.log(data);

    res.status(200).json({ success: true });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}