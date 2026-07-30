import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Fake single-password admin auth (see ADR 0010). A successful login mints a
// short JWT signed with ADMIN_SESSION_SECRET and stores it in an httpOnly
// cookie; the middleware and every write action verify it. There are no users
// — the token only asserts "this browser passed the password gate".

export const SESSION_COOKIE = "pp_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h

function secret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("Missing ADMIN_SESSION_SECRET");
  return new TextEncoder().encode(s);
}

// True if the plaintext password matches ADMIN_PASSWORD (constant-time-ish via
// jose is overkill here; a direct compare is fine for a single env secret).
export function passwordOk(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return typeof expected === "string" && expected.length > 0 && input === expected;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

// Verify a raw token string. Returns true iff signature + expiry are valid.
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Server-side guard for use inside server actions (cookies() is request-scoped).
export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
