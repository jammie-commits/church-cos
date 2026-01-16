import crypto from "crypto";

import { db } from "@/server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

function generateMemberId(prefix = "JTW"): string {
  const token = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `${prefix}-${token}`;
}

export async function createUniqueMemberId(prefix = "JTW", maxAttempts = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const memberId = generateMemberId(prefix);
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.memberId, memberId)).limit(1);
    if (existing.length === 0) return memberId;
  }
  throw new Error("Failed to generate unique member ID");
}
