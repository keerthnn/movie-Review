import prisma from "@/lib/prisma";
import { isAdmin } from "@/middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, description, releaseDate, posterUrl, createdById } = req.body;
    if (!(await isAdmin(req.user))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const movie = await prisma.movie.create({
      data: { title, description, releaseDate, posterUrl, createdById },
    });
    res.status(201).json(movie);
  }
  if (req.method === "GET") {
    const movies = await prisma.movie.findMany({ include: { reviews: true } });
    res.status(200).json(movies);
  }
}