import prisma from "@/lib/prisma";

export async function addUserToDB(firebaseUid: string, email: string) {
  try {
    let user = await prisma.user.findUnique({ where: { firebaseUid } });

    if (!user) {
      user = await prisma.user.create({
        data: { firebaseUid, email },
      });
    }

    return user;
  } catch (error) {
    console.error("Error syncing user to DB:", error);
    throw new Error("Failed to sync user to database");
  }
}
