import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { createSessionToken, hashPassword } from "@/server/auth";
import { createUniqueMemberId } from "@/server/member-id";

const RegisterBodySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(4).max(255),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = RegisterBodySchema.parse(json);

    const email = body.email.toLowerCase();

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const { salt, hash } = hashPassword(body.password);
    const username = email.split("@")[0] || null;
    const memberId = await createUniqueMemberId("JTW");

    const [created] = await db
      .insert(users)
      .values({
        email,
        firstName: body.firstName,
        lastName: body.lastName,
        username,
        role: "member",
        memberId,
        passwordSalt: salt,
        passwordHash: hash,
      })
      .returning({
        id: users.id,
        role: users.role,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        memberId: users.memberId,
      });

    const session = createSessionToken({ userId: created.id, role: created.role });

    const res = NextResponse.json({ user: created }, { status: 201 });
    res.cookies.set({
      name: "jtw_session",
      value: session,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request", issues: err.issues }, { status: 400 });
    }

    console.error("Register error:", err);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          message: "Registration failed",
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
