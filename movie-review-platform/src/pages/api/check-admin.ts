import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { firebaseUid } = req.query;
    if (!firebaseUid) {
      return res.status(400).json({ message: "Missing Firebase UID" });
    }

    try {
      const admin = await prisma.admin.findUnique({
        where: { firebaseUid: String(firebaseUid) },
      });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({ isAdmin: true, adminId: admin.id });
    } catch (error) {
      console.error("Error checking admin status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { firebaseUid } = req.body;
      if (!firebaseUid) {
        return res.status(400).json({ message: "Missing Firebase UID" });
      }

      const admin = await prisma.admin.findUnique({
        where: { firebaseUid },
      });

      return res.status(200).json({ isAdmin: !!admin, adminId: admin?.id });
    } catch (error) {
      console.error("Error checking admin status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
