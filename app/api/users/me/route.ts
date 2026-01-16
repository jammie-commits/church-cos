import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { departments, userDepartments, users } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";
import { verifySessionToken } from "@/server/auth";

const UpdateProfileSchema = z
  .object({
    gender: z.enum(["Male", "Female"]).optional(),
    age: z.coerce.number().int().min(0).max(130).optional(),
    nationalId: z.string().max(64).optional(),
    maritalStatus: z.string().max(64).optional(),
    childrenCount: z.coerce.number().int().min(0).max(50).optional(),
    phoneNumber: z.string().max(64).optional(),
    residenceAddress: z.string().max(255).optional(),
    employmentStatus: z.string().max(64).optional(),
    occupation: z.string().max(128).optional(),
    educationLevel: z.string().max(128).optional(),
    departments: z.array(z.string().min(1).max(100)).max(50).optional(),
  })
  .strict();

function getSessionTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)jtw_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function PATCH(req: Request) {
  try {
    const token = getSessionTokenFromCookieHeader(req.headers.get("cookie"));
    const payload = token ? verifySessionToken(token) : null;
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const updates = UpdateProfileSchema.parse(json);
    const { departments: deptNames, ...profileUpdates } = updates;

    await db.transaction(async (tx) => {
      if (Object.keys(profileUpdates).length > 0) {
        await tx
          .update(users)
          .set({ ...profileUpdates, updatedAt: new Date() })
          .where(eq(users.id, payload.userId));
      }

      if (deptNames) {
        const normalized = Array.from(
          new Set(deptNames.map((d) => d.trim()).filter((d) => d.length > 0)),
        ).slice(0, 50);

        if (normalized.length > 0) {
          const existing = await tx
            .select({ name: departments.name })
            .from(departments)
            .where(inArray(departments.name, normalized));

          const existingNames = new Set(existing.map((d) => d.name));
          const missing = normalized.filter((n) => !existingNames.has(n));

          for (const name of missing) {
            try {
              await tx.insert(departments).values({ name });
            } catch {
              // Ignore unique constraint races
            }
          }
        }

        const deptRows = normalized.length
          ? await tx
              .select({ id: departments.id, name: departments.name })
              .from(departments)
              .where(inArray(departments.name, normalized))
          : [];

        await tx.delete(userDepartments).where(eq(userDepartments.userId, payload.userId));

        if (deptRows.length > 0) {
          await tx.insert(userDepartments).values(
            deptRows.map((d) => ({
              userId: payload.userId,
              departmentId: d.id,
            })),
          );
        }
      }
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request", issues: err.issues }, { status: 400 });
    }

    console.error("Update profile error:", err);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
