import pg from "pg";

const baseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!baseUrl) {
  console.error("No DB url env set (DATABASE_URL/POSTGRES_URL/etc)");
  process.exit(2);
}

let parsed;
try {
  parsed = new URL(baseUrl);
} catch {
  console.error("Base DB URL is not a valid URL");
  process.exit(2);
}

const raw = process.env.DB_SSL_REJECT_UNAUTHORIZED ?? process.env.PGSSL_REJECT_UNAUTHORIZED;
const rejectUnauthorized =
  raw == null ? true : !["0", "false", "no"].includes(String(raw).toLowerCase());

const ssl = rejectUnauthorized
  ? { rejectUnauthorized }
  : { rejectUnauthorized, checkServerIdentity: () => undefined };

function sanitizeUrlForTls(urlString) {
  if (rejectUnauthorized) return urlString;
  try {
    const u = new URL(urlString);
    // Keep behavior consistent with script/db-check.mjs
    if (u.searchParams.has("sslmode")) u.searchParams.delete("sslmode");
    return u.toString();
  } catch {
    return urlString;
  }
}

const candidateHosts = [
  // Common Supabase pooler patterns
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-1-us-east-1.pooler.supabase.com",
  "aws-0-us-west-1.pooler.supabase.com",
  "aws-0-us-west-2.pooler.supabase.com",
  "aws-0-eu-west-1.pooler.supabase.com",
  "aws-0-eu-west-2.pooler.supabase.com",
  "aws-0-eu-central-1.pooler.supabase.com",
  "aws-0-ap-southeast-1.pooler.supabase.com",
  "aws-0-ap-northeast-1.pooler.supabase.com",
];

const ports = [6543, 5432];

function summarizeError(err) {
  const msg = err?.message ? String(err.message) : String(err);
  const code = err?.code ? String(err.code) : "";
  return [code, msg].filter(Boolean).join(" ");
}

console.log("Base host:", parsed.hostname);
console.log("User:", parsed.username);
console.log("DB:", parsed.pathname.replace(/^\//, ""));
console.log("SSL rejectUnauthorized:", rejectUnauthorized);
console.log("---");

const candidateUsers = [parsed.username, "postgres"].filter(
  (v, i, a) => v && a.indexOf(v) === i,
);

for (const host of candidateHosts) {
  for (const port of ports) {
    for (const user of candidateUsers) {
      const u = new URL(parsed.toString());
      u.hostname = host;
      u.port = String(port);
      u.username = user;

      const pool = new pg.Pool({
        connectionString: sanitizeUrlForTls(u.toString()),
        ssl,
        connectionTimeoutMillis: 4000,
        statement_timeout: 4000,
        query_timeout: 4000,
      });

      try {
        await pool.query("select 1 as ok");
        console.log(`OK  ${host}:${port} as ${user}`);
        await pool.end();
        process.exit(0);
      } catch (e) {
        console.log(`ERR ${host}:${port} as ${user} -> ${summarizeError(e)}`);
      } finally {
        await pool.end().catch(() => undefined);
      }
    }
  }
}

process.exit(1);
