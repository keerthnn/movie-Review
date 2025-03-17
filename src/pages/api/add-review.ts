import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content, rating, movieId, userId } = req.body;

      if (!content || !rating || !movieId || !userId) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      // ✅ Step 1: Check if movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found.' });
      }

      // ✅ Step 2: Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // ✅ Step 3: Create the review
      const review = await prisma.review.create({
        data: {
          content,
          rating,
          movieId,
          userId,
        },
      });

      return res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
