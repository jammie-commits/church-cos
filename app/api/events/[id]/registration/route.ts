import { NextResponse } from "next/server";

import { storage } from "@/server/storage";
import { getServerSession } from "@/server/session";

function parseEventId(id: string): number | null {
  const n = Number(id);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
  return n;
}

export async function GET(_req: Request, ctx: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(ctx.params);
  const eventId = parseEventId(id);
  if (!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

  const event = await storage.getEvent(eventId);
  if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

  const reg = await storage.getEventRegistration(eventId, session.userId);

  return NextResponse.json({
    ok: true,
    registration: reg
      ? {
          status: reg.status,
          createdAt: reg.createdAt ?? null,
          updatedAt: reg.updatedAt ?? null,
        }
      : null,
  });
}

export async function POST(_req: Request, ctx: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(ctx.params);
  const eventId = parseEventId(id);
  if (!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

  const event = await storage.getEvent(eventId);
  if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

  const reg = await storage.setEventRegistrationStatus({
    eventId,
    userId: session.userId,
    status: "Registered",
  });

  return NextResponse.json({ ok: true, registration: { status: reg.status } });
}

export async function DELETE(_req: Request, ctx: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(ctx.params);
  const eventId = parseEventId(id);
  if (!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

  const event = await storage.getEvent(eventId);
  if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

  const reg = await storage.setEventRegistrationStatus({
    eventId,
    userId: session.userId,
    status: "Cancelled",
  });

  return NextResponse.json({ ok: true, registration: { status: reg.status } });
}
