import { cookies } from "next/headers";

import { verifySessionToken, type SessionPayload } from "@/server/auth";

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jtw_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
