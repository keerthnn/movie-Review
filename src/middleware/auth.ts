import admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Import Prisma

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);
    // Fetch user from the Admin table in PostgreSQL
    const adminUser = await prisma.admin.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!adminUser) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Attach admin details to the request
    interface AuthenticatedRequest extends NextApiRequest {
      user?: { uid: string; email?: string };
    }
    (req as AuthenticatedRequest).user = { uid: decodedToken.uid, email: decodedToken.email };
    
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
