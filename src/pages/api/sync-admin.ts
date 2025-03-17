import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, firebaseUid, email } = req.body;

    if (!id || !firebaseUid || !email) {
      return res.status(400).json({ message: "Missing admin data" });
    }

    // Check if admin exists with all credentials
    const admin = await prisma.admin.findUnique({
      where: { id, email, firebaseUid },
    });

    if (!admin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Admin authenticated", isAdmin: true });
  } catch (error) {
    console.error("Error syncing admin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
