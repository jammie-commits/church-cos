import crypto from "crypto";

export type AppRole = "member" | "admin" | "top_admin" | "finance";

export type SessionPayload = {
  userId: string;
  role: AppRole;
  exp: number; // unix seconds
};

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeToBuffer(input: string): Buffer {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

function hmacSha256(secret: string, data: string): string {
  return base64UrlEncode(crypto.createHmac("sha256", secret).update(data).digest());
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set");
  }
  return secret;
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">, ttlSeconds = 60 * 60 * 24 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };

  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const sig = hmacSha256(getSessionSecret(), payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expectedSig = hmacSha256(getSessionSecret(), payloadB64);

  // constant-time compare
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }

  if (!payload?.userId) return null;
  if (payload.role !== "member" && payload.role !== "admin" && payload.role !== "top_admin" && payload.role !== "finance") {
    return null;
  }
  if (typeof payload.exp !== "number") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return { salt, hash: derivedKey.toString("hex") };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(derivedKey, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
