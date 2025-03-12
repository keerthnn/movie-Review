import prisma from "@/lib/prisma";
import { authenticate } from "@/middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await authenticate(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, description, releaseDate, posterUrl } = req.body;
    const userId = (req as any).user.uid;

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterUrl,
        createdById: userId,
      },
    });

    return res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
