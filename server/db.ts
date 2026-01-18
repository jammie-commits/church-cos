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

function stripQueryParam(url: string, param: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (!parsed.searchParams.has(param)) return url;
  parsed.searchParams.delete(param);
  return parsed.toString();
}

function buildSslOptions(url: string): pg.PoolConfig["ssl"] | undefined {
  const rejectUnauthorizedRaw =
    process.env.DB_SSL_REJECT_UNAUTHORIZED ?? process.env.PGSSL_REJECT_UNAUTHORIZED;
  const rejectUnauthorizedOverride =
    rejectUnauthorizedRaw == null
      ? undefined
      : !["0", "false", "no"].includes(rejectUnauthorizedRaw.toLowerCase());

  // If the caller explicitly disables verification, honor it even if the URL
  // is malformed or doesn't include sslmode.
  if (rejectUnauthorizedOverride === false) {
    return {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // If the caller explicitly requested verification, keep it.
    return rejectUnauthorizedOverride === true
      ? { rejectUnauthorized: true }
      : undefined;
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
    return {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    };
  }

  return { rejectUnauthorized: rejectUnauthorizedOverride ?? true };
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
const ssl = buildSslOptions(connectionString);

// `pg` will derive SSL behavior from `sslmode` in the connection string and can
// override explicit `ssl` options. When we supply an `ssl` config object, strip
// `sslmode` so that our options win.
const sanitizedConnectionString =
  ssl == null ? connectionString : stripQueryParam(connectionString, "sslmode");

export const pool = new Pool({
  connectionString: sanitizedConnectionString,
  ssl,
});
export const db = drizzle(pool, { schema });
