import { NextResponse } from "next/server";
import { z } from "zod";

import { storage } from "@/server/storage";
import { getServerSession } from "@/server/session";
import { isAdminLike } from "@/server/require-role";

const CreateSchema = z.object({
  departmentId: z.number().int().positive(),
  year: z.number().int().min(2000).max(3000),
  title: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  amount: z.union([z.string(), z.number()]),
});

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const yearStr = url.searchParams.get("year");
  const year = yearStr ? Number(yearStr) : undefined;

  if (isAdminLike(session.role)) {
    const rows = await storage.getDepartmentBudgetRequests({ year: typeof year === "number" && Number.isFinite(year) ? year : undefined });
    return NextResponse.json({ ok: true, requests: rows });
  }

  const deptIds = await storage.getUserDepartments(session.userId);
  const rows = await storage.getDepartmentBudgetRequests({
    year: typeof year === "number" && Number.isFinite(year) ? year : undefined,
    departmentIds: deptIds,
  });
  return NextResponse.json({ ok: true, requests: rows });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const body = CreateSchema.parse(json);

  const myDeptIds = await storage.getUserDepartments(session.userId);
  const allowed = isAdminLike(session.role) || myDeptIds.includes(body.departmentId);
  if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const created = await storage.createDepartmentBudgetRequest({
    departmentId: body.departmentId,
    requesterUserId: session.userId,
    year: body.year,
    title: body.title,
    description: body.description ?? null,
    amount: String(body.amount),
  } as any);

  return NextResponse.json({ ok: true, request: created });
}
