import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      return res.status(200).json({ message: "Admin exists", admin });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error: any) {
    console.error("Error checking admin:", error.message, error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
