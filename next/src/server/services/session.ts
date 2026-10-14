import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "agrorunok_session";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function sessionExpiresAt(now: Date = new Date()): Date {
  return new Date(now.getTime() + SESSION_MAX_AGE * 1000);
}

export async function getSessionTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
