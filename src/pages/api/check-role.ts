import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Missing email" });
    }

    // Check if the user is an admin
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      return res.status(200).json({ role: "admin" });
    }

    // Check if the user is a regular user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(200).json({ role: "user", userId: user.id });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error checking user role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
