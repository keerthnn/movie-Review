import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, description, releaseDate, posterUrl, createdById } = req.body;

    // Ensure admin ID is present
    if (!createdById) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterUrl,
        createdById, // Use admin ID from request body
      },
    });

    return res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
