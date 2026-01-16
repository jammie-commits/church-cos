import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function buildSslOptions(url: string): pg.ConnectionOptions["ssl"] | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  const sslmode = parsed.searchParams.get("sslmode");
  const hostname = parsed.hostname;

  const wantsSsl =
    sslmode === "require" ||
    sslmode === "verify-ca" ||
    sslmode === "verify-full" ||
    sslmode === "no-verify" ||
    hostname.endsWith("supabase.com") ||
    hostname.includes("pooler.supabase.com");

  if (!wantsSsl) return undefined;

  if (sslmode === "no-verify") {
    return { rejectUnauthorized: false };
  }

  const rejectUnauthorizedRaw =
    process.env.DB_SSL_REJECT_UNAUTHORIZED ?? process.env.PGSSL_REJECT_UNAUTHORIZED;
  const rejectUnauthorized =
    rejectUnauthorizedRaw == null
      ? true
      : !["0", "false", "no"].includes(rejectUnauthorizedRaw.toLowerCase());

  return { rejectUnauthorized };
}

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = stripWrappingQuotes(databaseUrl);
export const pool = new Pool({
  connectionString,
  ssl: buildSslOptions(connectionString),
});
export const db = drizzle(pool, { schema });
