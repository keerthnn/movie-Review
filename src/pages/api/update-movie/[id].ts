import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;
    const { title, description, releaseDate, posterUrl } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: id as string },
      data: {
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterUrl,
      },
    });

    return res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
