import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { firebaseUid, email } = req.body;
    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "Missing user data" });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { firebaseUid } });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid, email },
      });
    }

    return res.status(200).json({ message: "User synced", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
