import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const movies = await prisma.movie.findMany({
      where: { createdById: String(adminId) },
      include: { reviews: true },
      orderBy: { releaseDate: "desc" },
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching admin movies:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
