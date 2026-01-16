import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { verifySessionToken } from "@/server/auth";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)jtw_session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      memberId: users.memberId,
    })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  return NextResponse.json({ user: user ?? null }, { status: 200 });
}
