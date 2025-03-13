import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: String(id) },
      include: { 
        reviews: { include: { user: true } }, // Include user details in reviews
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
