import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Credentials for the internal admin area, as requested by the association.
 * They can be overridden through environment variables if they should ever
 * change without a new deployment.
 */
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "987654321";

export const ADMIN_COOKIE = "yc_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function sessionToken(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    `yc-session:${process.env.DB_PASSWORD ?? "al-salam"}`;
  return createHash("sha256").update(secret).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyCredentials(
  username: string,
  password: string
): boolean {
  return (
    safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD)
  );
}

/** Reads the admin cookie and checks the session token. */
export async function isAuthenticated(): Promise<boolean> {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}

export function adminCookieOptions() {
  return {
    name: ADMIN_COOKIE,
    value: sessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
