import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Check user error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
