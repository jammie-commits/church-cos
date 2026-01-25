import { NextResponse } from "next/server";
import { z } from "zod";

import { storage } from "@/server/storage";
import { requireAdminSession } from "@/server/require-admin";

const BodySchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  decisionNote: z.string().max(2000).optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();

  const params = await ctx.params;
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const json = await req.json();
  const body = BodySchema.parse(json);

  const updated = await storage.decideDepartmentBudgetRequest({
    id,
    status: body.status,
    reviewerUserId: session.userId,
    decisionNote: body.decisionNote ?? null,
  });

  return NextResponse.json({ ok: true, request: updated });
}
