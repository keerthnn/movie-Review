import prisma from "@/lib/prisma";
import { authenticate, isAdmin } from "@/middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Authenticate request and attach user to req.user
  await authenticate(req, res);

  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { title, description, releaseDate, posterUrl, createdById } = req.body;

    // Check if user is an admin
    if (!(await isAdmin((req as any).user))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterUrl,
        createdById,
      },
    });

    return res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
