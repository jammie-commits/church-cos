import fs from "node:fs";

const ENV_PATH = ".env";

const raw = fs.readFileSync(ENV_PATH, "utf8");
const backupPath = `.env.bak.${Date.now()}`;
fs.writeFileSync(backupPath, raw);

const TARGET_KEYS = new Set([
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
]);

function stripOuterQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return { value: value.slice(1, -1), quote: first };
    }
  }
  return { value, quote: "" };
}

function extractProjectRefFromUser(username) {
  const match = /^postgres\.(.+)$/.exec(username || "");
  return match ? match[1] : null;
}

function rewriteSupabaseUrl(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return urlString;
  }

  const ref = extractProjectRefFromUser(url.username);
  if (ref === null) return urlString;

  const isPooler = url.hostname.includes("pooler.supabase.com");
  const isSupabase = url.hostname.endsWith("supabase.com") || url.hostname.endsWith("supabase.co");
  if (isPooler === false && isSupabase === false) return urlString;

  url.hostname = `db.${ref}.supabase.co`;
  url.port = "5432";
  url.username = "postgres";

  return url.toString();
}

const lines = raw.split(/\r?\n/);
let sawRejectUnauthorized = false;
let changedCount = 0;

const nextLines = lines.map((line) => {
  const match = /^([A-Z0-9_]+)=(.*)$/.exec(line);
  if (match === null) return line;

  const key = match[1];
  const value = match[2];

  if (key === "DB_SSL_REJECT_UNAUTHORIZED") {
    sawRejectUnauthorized = true;
    return line;
  }

  if (TARGET_KEYS.has(key) === false) return line;

  const { value: unquoted, quote } = stripOuterQuotes(value.trim());
  const rewritten = rewriteSupabaseUrl(unquoted);
  if (rewritten === unquoted) return line;

  changedCount += 1;
  const out = quote ? `${quote}${rewritten}${quote}` : rewritten;
  return `${key}=${out}`;
});

if (sawRejectUnauthorized === false) {
  nextLines.push("DB_SSL_REJECT_UNAUTHORIZED=true");
}

fs.writeFileSync(ENV_PATH, nextLines.join("\n"));

console.log("Updated .env Supabase URLs to direct host.");
console.log("Backup:", backupPath);
console.log("Rewritten keys:", changedCount);
