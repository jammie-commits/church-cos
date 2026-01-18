import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { createSessionToken, verifyPassword } from "@/server/auth";

const LoginBodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = LoginBodySchema.parse(json);

    const email = body.email.toLowerCase();

    const found = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        passwordHash: users.passwordHash,
        passwordSalt: users.passwordSalt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = found[0];
    if (!user.passwordHash || !user.passwordSalt) {
      return NextResponse.json({ message: "Account must be reset. Please register again." }, { status: 401 });
    }

    const ok = verifyPassword(body.password, user.passwordSalt, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const session = createSessionToken({ userId: user.id, role: user.role });
    const res = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 200 },
    );

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

    console.error("Login error:", err);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          message: "Login failed",
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
