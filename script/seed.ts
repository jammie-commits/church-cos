import "dotenv/config";

import { db, pool } from "../server/db";
import {
  departments,
  attendance,
  events,
  eventRegistrations,
  notifications,
  projects,
  projectBudgets,
  transactions,
  utilities,
  utilityBudgets,
  userDepartments,
  users,
} from "../shared/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { hashPassword } from "../server/auth";

function daysAgo(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function atTime(date: Date, hours: number, minutes = 0): Date {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function yyyymmdd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length]!;
}

const SEED_DOMAIN = "jtw.local";
const SEED_EMAIL_PREFIX = "seed.";
const SEED_TAG = "[seed]";

const DEPARTMENT_NAMES = [
  "Disciples",
  "Ushers",
  "Pastoral",
  "Intercessory",
  "Hospitality",
  "Media",
  "Praise & Worship",
  "Welfare",
  "Repair & Maintenance",
  "Prayer Line",
  "Sound",
];

const UTILITY_ITEMS: Array<{ name: string; description: string }> = [
  { name: "Tissue Papers", description: "Toiletries (restrooms and service areas)" },
  { name: "Liquid Soap", description: "Hand wash / cleaning supplies" },
  { name: "Electricity Bills", description: "Power and lighting" },
  { name: "Sunday School Breakfast", description: "Snacks/tea/breakfast for Sunday school" },
  { name: "Drinking Water", description: "Bottled/water dispenser refills" },
];

async function ensureDepartments() {
  const existing = await db.select({ name: departments.name }).from(departments);
  const existingNames = new Set(existing.map((d) => d.name));

  for (const name of DEPARTMENT_NAMES) {
    if (existingNames.has(name)) continue;
    try {
      await db.insert(departments).values({ name });
    } catch {
      // ignore unique races
    }
  }

  return db
    .select({ id: departments.id, name: departments.name })
    .from(departments)
    .where(inArray(departments.name, DEPARTMENT_NAMES));
}

async function ensureUtilities() {
  const existing = await db.select({ name: utilities.name }).from(utilities);
  const existingNames = new Set(existing.map((u) => u.name));

  for (const item of UTILITY_ITEMS) {
    if (existingNames.has(item.name)) continue;
    try {
      await db.insert(utilities).values({ name: item.name, description: item.description, active: true });
    } catch {
      // ignore unique races
    }
  }

  return db
    .select({ id: utilities.id, name: utilities.name })
    .from(utilities)
    .where(inArray(utilities.name, UTILITY_ITEMS.map((i) => i.name)));
}

async function upsertAdmin() {
  const email = "jay.mbugua.ph@gmail.com";
  const { salt, hash } = hashPassword("admin");

  const found = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (found.length === 0) {
    await db.insert(users).values({
      email,
      firstName: "James",
      lastName: "Mbugua",
      username: "jay.mbugua.ph",
      role: "top_admin",
      memberId: "ADMIN-000001",
      passwordSalt: salt,
      passwordHash: hash,
    });
    return;
  }

  await db
    .update(users)
    .set({
      firstName: "James",
      lastName: "Mbugua",
      role: "top_admin",
      passwordSalt: salt,
      passwordHash: hash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, found[0]!.id));
}

async function cleanupSeedData() {
  const seedUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`${users.email} like ${SEED_EMAIL_PREFIX + "%@" + SEED_DOMAIN}`);

  const seedUserIds = seedUsers.map((u) => u.id);

  // Remove seeded children rows first
  await db.delete(transactions).where(sql`${transactions.transactionCode} like ${"SEED-%"}`);
  await db.delete(notifications).where(sql`${notifications.message} like ${"%" + SEED_TAG + "%"}`);

  if (seedUserIds.length > 0) {
    await db.delete(userDepartments).where(inArray(userDepartments.userId, seedUserIds));
  }

  // Attendance (seeded users + seeded events)
  if (seedUserIds.length > 0) {
    await db.delete(attendance).where(inArray(attendance.userId, seedUserIds));
  }
  await db.delete(attendance).where(
    sql`${attendance.eventId} IN (select ${events.id} from ${events} where ${events.title} like ${"%" + SEED_TAG + "%"})`
  );

  // Event registrations (seeded users + seeded events)
  if (seedUserIds.length > 0) {
    await db.delete(eventRegistrations).where(inArray(eventRegistrations.userId, seedUserIds));
  }
  await db.delete(eventRegistrations).where(
    sql`${eventRegistrations.eventId} IN (select ${events.id} from ${events} where ${events.title} like ${"%" + SEED_TAG + "%"})`
  );

  // Clean up seeded projects/events
  await db.delete(projects).where(sql`${projects.name} like ${"%" + SEED_TAG + "%"}`);
  await db.delete(events).where(sql`${events.title} like ${"%" + SEED_TAG + "%"}`);

  // Finally delete seeded users
  if (seedUserIds.length > 0) {
    await db.delete(users).where(inArray(users.id, seedUserIds));
  }
}

async function seedUsersAndData() {
  const now = new Date();
  const deptRows = await ensureDepartments();
  const utilityRows = await ensureUtilities();

  const { salt: seedSalt, hash: seedHash } = hashPassword("password");

  // Create 15 demo members
  const demoUsers: { id: string; email: string | null }[] = [];

  for (let i = 1; i <= 15; i++) {
    const num = String(i).padStart(2, "0");
    const email = `${SEED_EMAIL_PREFIX}member${num}@${SEED_DOMAIN}`;
    const username = `seed_member${num}`;

    const [created] = await db
      .insert(users)
      .values({
        email,
        firstName: `Member${num}`,
        lastName: "Demo",
        username,
        role: "member",
        memberId: `SEED-${num}`,
        passwordSalt: seedSalt,
        passwordHash: seedHash,
      })
      .returning({ id: users.id, email: users.email });

    demoUsers.push(created);

    // Assign each user 1-3 departments
    const deptCount = 1 + (i % 3);
    const deptIds = new Set<number>();
    for (let j = 0; j < deptCount; j++) {
      deptIds.add(pick(deptRows, i + j).id);
    }

    await db.insert(userDepartments).values(
      Array.from(deptIds).map((departmentId) => ({
        userId: created.id,
        departmentId,
      })),
    );
  }

  // Create 3 demo projects
  const projectRows = await db
    .insert(projects)
    .values([
      {
        name: `Sanctuary Renovation ${SEED_TAG}`,
        description: "Renovation fundraising for the main sanctuary.",
        status: "Active",
        targetAmount: "250000",
        collectedAmount: "78000",
        startDate: daysAgo(now, 25),
        endDate: daysAgo(now, -20),
      },
      {
        name: `Youth Outreach ${SEED_TAG}`,
        description: "Community outreach program for youth.",
        status: "Upcoming",
        targetAmount: "80000",
        collectedAmount: "0",
        startDate: daysAgo(now, 5),
        endDate: daysAgo(now, -60),
      },
      {
        name: `Media Equipment ${SEED_TAG}`,
        description: "New sound + video equipment.",
        status: "Active",
        targetAmount: "120000",
        collectedAmount: "34000",
        startDate: daysAgo(now, 15),
        endDate: daysAgo(now, -30),
      },
    ])
    .returning({ id: projects.id });

  const projectIds = projectRows.map((p) => p.id);

  // Seed budgets for current year (projects + utilities)
  const year = now.getFullYear();
  for (const pid of projectIds) {
    try {
      await db.insert(projectBudgets).values({ projectId: pid, year, amount: "5000" });
    } catch {
      // ignore
    }
  }
  for (const u of utilityRows) {
    try {
      await db.insert(utilityBudgets).values({ utilityId: u.id, year, amount: "500" });
    } catch {
      // ignore
    }
  }

  // Create events over last 30 days (services + a few events)
  const eventInsert: { title: string; description: string; date: Date; location: string; type: "Service" | "Event" }[] = [];

  for (let d = 0; d < 30; d++) {
    const day = daysAgo(now, 29 - d);
    const weekday = day.getDay(); // 0=Sun

    if (weekday === 0) {
      eventInsert.push({
        title: `Sunday Service ${SEED_TAG}`,
        description: "Weekly service.",
        date: atTime(day, 10, 0),
        location: "Main Sanctuary",
        type: "Service",
      });
    }

    if (weekday === 3) {
      eventInsert.push({
        title: `Midweek Fellowship ${SEED_TAG}`,
        description: "Midweek prayer and fellowship.",
        date: atTime(day, 18, 30),
        location: "Fellowship Hall",
        type: "Event",
      });
    }
  }

  if (eventInsert.length > 0) {
    const insertedEvents = await db
      .insert(events)
      .values(eventInsert)
      .returning({ id: events.id, title: events.title, date: events.date, type: events.type, location: events.location });

    // Seed registrations + attendance for demo users
    const statuses = ["Present", "Present", "Present", "Present", "Absent", "Excused"] as const;
    const attendanceRows: Array<{ eventId: number; userId: string; status: (typeof statuses)[number] }> = [];
    const registrationRows: Array<{ eventId: number; userId: string; status: "Registered" | "Cancelled" }> = [];

    for (const e of insertedEvents) {
      // Pick ~12 registrations per event
      for (let i = 0; i < 12; i++) {
        const user = pick(demoUsers, e.id + i);
        const status: "Registered" | "Cancelled" = i === 11 && e.id % 5 === 0 ? "Cancelled" : "Registered";
        registrationRows.push({ eventId: e.id, userId: user.id, status });
      }

      // Pick ~10 users per event
      for (let i = 0; i < 10; i++) {
        const user = pick(demoUsers, e.id + i);
        const status = pick([...statuses], e.id + i * 7);
        attendanceRows.push({ eventId: e.id, userId: user.id, status });
      }
    }

    if (registrationRows.length > 0) {
      await db.insert(eventRegistrations).values(registrationRows as any);
    }

    if (attendanceRows.length > 0) {
      await db.insert(attendance).values(attendanceRows as any);
    }
  }

  // Create a few future events (so "registered (upcoming)" is visible)
  const futureEvents: { title: string; description: string; date: Date; location: string; type: "Service" | "Event" }[] = [];
  for (let d = 1; d <= 14; d++) {
    const day = daysAgo(now, -d);
    const weekday = day.getDay();
    if (weekday === 0) {
      futureEvents.push({
        title: `Sunday Service (Upcoming) ${SEED_TAG}`,
        description: "Weekly service.",
        date: atTime(day, 10, 0),
        location: "Main Sanctuary",
        type: "Service",
      });
    }
    if (weekday === 5 && futureEvents.length < 6) {
      futureEvents.push({
        title: `Youth Hangout (Upcoming) ${SEED_TAG}`,
        description: "Community hangout and fellowship.",
        date: atTime(day, 17, 0),
        location: "Fellowship Hall",
        type: "Event",
      });
    }
    if (futureEvents.length >= 6) break;
  }

  if (futureEvents.length > 0) {
    const insertedFutureEvents = await db
      .insert(events)
      .values(futureEvents)
      .returning({ id: events.id });

    const futureRegistrationRows: Array<{ eventId: number; userId: string; status: "Registered" | "Cancelled" }> = [];
    for (const e of insertedFutureEvents) {
      for (let i = 0; i < 6; i++) {
        const user = pick(demoUsers, e.id + i);
        futureRegistrationRows.push({ eventId: e.id, userId: user.id, status: "Registered" });
      }
    }
    if (futureRegistrationRows.length > 0) {
      await db.insert(eventRegistrations).values(futureRegistrationRows as any);
    }
  }

  // Create transactions & notifications across last 30 days
  const categories = ["Tithe", "Offering", "Project", "Seed", "Thanksgiving"] as const;
  const payTypes = ["MPESA", "Bank"] as const;

  for (let d = 0; d < 30; d++) {
    const day = daysAgo(now, 29 - d);
    const dayKey = yyyymmdd(day);

    for (let i = 0; i < 8; i++) {
      const user = pick(demoUsers, d + i);
      const category = pick([...categories], d + i);
      const type = pick([...payTypes], d + i * 3);

      const base = 100 + ((d + i) % 12) * 50;
      const amount = String(base + ((d * 7 + i * 11) % 200));

      const projectId = category === "Project" ? pick(projectIds, d + i) : null;

      await db.insert(transactions).values({
        userId: user.id,
        amount,
        category,
        type,
        transactionCode: `SEED-${dayKey}-${String(i + 1).padStart(2, "0")}`,
        purpose: `Auto-generated giving ${SEED_TAG}`,
        projectId,
        date: atTime(day, 12, 0),
        status: "Completed",
      });

      if (i < 3) {
        await db.insert(notifications).values({
          userId: user.id,
          type: category === "Project" ? "Payment" : "Payment",
          message: `Payment received: ${category} (${amount}) ${SEED_TAG}`,
          read: i === 0,
          createdAt: atTime(day, 12, 5),
        });
      }
    }
  }
}

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Ensure you have a .env file with DATABASE_URL or POSTGRES_URL.");
  }

  console.log("Seeding database...");

  await cleanupSeedData();
  await upsertAdmin();
  await seedUsersAndData();

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
