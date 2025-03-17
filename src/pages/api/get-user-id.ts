import { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    // 🔹 Query database using Prisma to get the user ID
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
