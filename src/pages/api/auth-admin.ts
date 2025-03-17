import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    // Check if user exists in the Admin table
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
