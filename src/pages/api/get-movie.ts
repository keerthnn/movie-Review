import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const movies = await prisma.movie.findMany({
      include: { reviews: true },
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
