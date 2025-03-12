import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { firebaseUid } = req.body;
    if (!firebaseUid) {
      return res.status(400).json({ message: "Missing Firebase UID" });
    }

    const admin = await prisma.admin.findUnique({
      where: { firebaseUid },
    });

    return res.status(200).json({ isAdmin: !!admin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
