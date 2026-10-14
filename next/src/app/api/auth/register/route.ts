import { NextResponse } from "next/server";
import { registerUser } from "@/server/modules/auth";
import { SESSION_COOKIE, sessionCookieOptions } from "@/server/services/session";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  try {
    const { user, sessionToken } = await registerUser(raw);
    const response = NextResponse.json(user, { status: 201 });
    response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
