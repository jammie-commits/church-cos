import fs from "node:fs";

const ENV_PATH = ".env";
const raw = fs.readFileSync(ENV_PATH, "utf8");
const backupPath = `.env.bak.${Date.now()}`;
fs.writeFileSync(backupPath, raw);

const lines = raw.split(/\r?\n/);

function parseEnv(linesIn) {
  const map = new Map();
  for (const line of linesIn) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line);
    if (m === null) continue;
    map.set(m[1], m[2]);
  }
  return map;
}

function stripOuterQuotes(value) {
  const v = value.trim();
  if (v.length >= 2) {
    const first = v[0];
    const last = v[v.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return { value: v.slice(1, -1), quote: first };
    }
  }
  return { value: v, quote: "" };
}

function extractProjectRefFromUser(username) {
  const match = /^postgres\.(.+)$/.exec(username || "");
  return match ? match[1] : null;
}

function extractProjectRefFromSupabaseUrlText(text) {
  // Matches both commented and uncommented forms like:
  // NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
  // SUPABASE_URL=https://<ref>.supabase.co
  const match = /https:\/\/([a-z0-9]{20})\.supabase\.(co|com)/i.exec(text);
  return match ? match[1] : null;
}

function findLatestEnvBackupPath() {
  const entries = fs
    .readdirSync(".")
    .filter((f) => f.startsWith(".env.bak."))
    .sort((a, b) => (a < b ? 1 : -1));
  return entries[0] ?? null;
}

const env = parseEnv(lines);
const pickRaw =
  env.get("POSTGRES_PRISMA_URL") ??
  env.get("DATABASE_URL") ??
  env.get("POSTGRES_URL") ??
  env.get("POSTGRES_URL_NON_POOLING");

if (pickRaw == null) {
  console.error("No DATABASE_URL/POSTGRES_URL env found to base pooler URL on.");
  process.exit(2);
}

const { value: pickedUrl } = stripOuterQuotes(pickRaw);
let parsed;
try {
  parsed = new URL(pickedUrl);
} catch (e) {
  console.error("Could not parse picked DB URL:", e?.message ?? e);
  process.exit(2);
}

let ref = extractProjectRefFromUser(parsed.username);
if (ref === null) {
  ref = extractProjectRefFromSupabaseUrlText(raw);
}

if (ref === null) {
  const latestBackup = findLatestEnvBackupPath();
  if (latestBackup) {
    try {
      const backupRaw = fs.readFileSync(latestBackup, "utf8");
      ref = extractProjectRefFromSupabaseUrlText(backupRaw);
      if (ref === null) {
        const bEnv = parseEnv(backupRaw.split(/\r?\n/));
        const bPick =
          bEnv.get("POSTGRES_PRISMA_URL") ??
          bEnv.get("DATABASE_URL") ??
          bEnv.get("POSTGRES_URL") ??
          bEnv.get("POSTGRES_URL_NON_POOLING");
        if (bPick != null) {
          const { value: bUrl } = stripOuterQuotes(bPick);
          const u = new URL(bUrl);
          ref = extractProjectRefFromUser(u.username);
        }
      }
    } catch {
      // ignore
    }
  }
}

if (ref === null) {
  console.error(
    "Could not determine Supabase project ref. Provide a pooler URL with username postgres.<ref> or set NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co in .env.",
  );
  process.exit(2);
}

const password = parsed.password;
if (password.length === 0) {
  console.error("DB password is empty in existing URL.");
  process.exit(2);
}

// Use last known pooler host if present in backups, otherwise default.
let poolerHost = "aws-1-us-east-1.pooler.supabase.com";
for (const candidate of [env.get("POSTGRES_PRISMA_URL"), env.get("DATABASE_URL"), env.get("POSTGRES_URL")]) {
  if (candidate == null) continue;
  const { value: cand } = stripOuterQuotes(candidate);
  try {
    const u = new URL(cand);
    if (u.hostname.includes("pooler.supabase.com")) {
      poolerHost = u.hostname;
      break;
    }
  } catch {
    // ignore
  }
}

function buildPoolerUrl(port) {
  const u = new URL("postgres://placeholder/placeholder");
  u.protocol = "postgres:";
  u.username = `postgres.${ref}`;
  u.password = password;
  u.hostname = poolerHost;
  u.port = String(port);
  u.pathname = "/postgres";
  u.searchParams.set("sslmode", "require");
  u.searchParams.set("pgbouncer", "true");
  return u.toString();
}

const cleanTxPooler = buildPoolerUrl(6543);
const cleanSessionPooler = buildPoolerUrl(5432);

const SET_KEYS = new Map([
  ["DATABASE_URL", cleanTxPooler],
  ["POSTGRES_PRISMA_URL", cleanTxPooler],
  ["POSTGRES_URL", cleanTxPooler],
  ["POSTGRES_URL_NON_POOLING", cleanSessionPooler],
]);

const nextLines = lines.map((line) => {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line);
  if (m === null) return line;
  const key = m[1];
  const prevRaw = m[2];
  if (SET_KEYS.has(key) === false) return line;
  const nextValue = SET_KEYS.get(key);
  const quote =
    prevRaw.trim().startsWith('"') && prevRaw.trim().endsWith('"')
      ? '"'
      : prevRaw.trim().startsWith("'") && prevRaw.trim().endsWith("'")
        ? "'"
        : "";
  return `${key}=${quote ? `${quote}${nextValue}${quote}` : nextValue}`;
});

fs.writeFileSync(ENV_PATH, nextLines.join("\n"));
console.log("Rewrote Supabase DB URLs to clean pooler form.");
console.log("Pooler host:", poolerHost);
console.log("Backup:", backupPath);
