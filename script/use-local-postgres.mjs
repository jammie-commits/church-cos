import fs from "node:fs";

const ENV_PATH = ".env";

const raw = fs.readFileSync(ENV_PATH, "utf8");
const backupPath = `.env.supabase.bak.${Date.now()}`;
fs.writeFileSync(backupPath, raw);

const LOCAL_URL = "postgres://postgres:postgres@localhost:54322/church_manager";

const keysToSet = new Map([
  ["DATABASE_URL", LOCAL_URL],
  ["POSTGRES_URL", LOCAL_URL],
  ["POSTGRES_URL_NON_POOLING", LOCAL_URL],
  ["POSTGRES_PRISMA_URL", LOCAL_URL],
  // Ensure local connections don't force SSL
  ["DB_SSL_REJECT_UNAUTHORIZED", "true"],
]);

const lines = raw.split(/\r?\n/);
const seen = new Set();

const next = lines.map((line) => {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line);
  if (m === null) return line;
  const key = m[1];
  if (!keysToSet.has(key)) return line;
  seen.add(key);
  return `${key}=${keysToSet.get(key)}`;
});

for (const [key, value] of keysToSet.entries()) {
  if (seen.has(key)) continue;
  next.push(`${key}=${value}`);
}

fs.writeFileSync(ENV_PATH, next.join("\n"));
console.log("Switched .env to local Postgres.");
console.log("Backup:", backupPath);
console.log("Local DB:", LOCAL_URL);
