import { NextResponse } from "next/server";
import { z } from "zod";

import { storage } from "@/server/storage";
import { requireFinanceBudgetAccess } from "@/server/require-role";

const BodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  await requireFinanceBudgetAccess();

  const json = await req.json();
  const body = BodySchema.parse(json);

  const created = await storage.createUtility({
    name: body.name,
    description: body.description ?? null,
    active: body.active ?? true,
  } as any);

  return NextResponse.json({ ok: true, utility: created });
}
