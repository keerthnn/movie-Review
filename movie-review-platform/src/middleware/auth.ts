import { auth } from "@/lib/firebase";

export async function isAdmin(user: any): Promise<boolean> {
  const token = await user.getIdTokenResult();
  return token.claims.admin === true;
}