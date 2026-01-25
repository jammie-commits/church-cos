import { NextResponse } from "next/server";
import { z } from "zod";

import { storage } from "@/server/storage";
import { requireFinanceBudgetAccess } from "@/server/require-role";

const BodySchema = z.object({
  kind: z.enum(["project", "utility"]),
  id: z.number().int().positive(),
  year: z.number().int().min(2000).max(3000),
  amount: z.union([z.string(), z.number()]),
});

export async function POST(req: Request) {
  await requireFinanceBudgetAccess();

  const json = await req.json();
  const body = BodySchema.parse(json);

  const amount = String(body.amount);

  if (body.kind === "project") {
    const row = await storage.upsertProjectBudget({ projectId: body.id, year: body.year, amount });
    return NextResponse.json({ ok: true, budget: row });
  }

  const row = await storage.upsertUtilityBudget({ utilityId: body.id, year: body.year, amount });
  return NextResponse.json({ ok: true, budget: row });
}
