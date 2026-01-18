import pg from "pg";

const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error("No DB url env set (DATABASE_URL/POSTGRES_URL/etc)");
  process.exit(2);
}

const raw = process.env.DB_SSL_REJECT_UNAUTHORIZED ?? process.env.PGSSL_REJECT_UNAUTHORIZED;
const rejectUnauthorized =
  raw == null ? true : !["0", "false", "no"].includes(String(raw).toLowerCase());

console.log("SSL_REJECT_UNAUTHORIZED_RAW", raw ?? "(unset)");
console.log("SSL_REJECT_UNAUTHORIZED", rejectUnauthorized);

let sanitizedUrl = url;
try {
  const parsed = new URL(url);
  if (!rejectUnauthorized && parsed.searchParams.has("sslmode")) {
    parsed.searchParams.delete("sslmode");
    sanitizedUrl = parsed.toString();
  }
} catch {
  // ignore
}

const ssl = rejectUnauthorized
  ? { rejectUnauthorized }
  : { rejectUnauthorized, checkServerIdentity: () => undefined };

const pool = new pg.Pool({
  connectionString: sanitizedUrl,
  ssl,
});

try {
  const one = await pool.query("select 1 as ok");
  const reg = await pool.query(
    "select to_regclass('public.users') as users, to_regclass('public.members') as members, to_regclass('public.transactions') as transactions",
  );
  console.log("DB_OK", one.rows[0]?.ok);
  console.log("TABLES", reg.rows[0]);
} catch (e) {
  console.error("DB_CHECK_FAILED", e?.message ?? e);
  process.exitCode = 1;
} finally {
  await pool.end();
}
