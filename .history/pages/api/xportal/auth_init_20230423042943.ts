import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
    
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}