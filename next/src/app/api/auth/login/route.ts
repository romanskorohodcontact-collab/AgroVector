import { NextResponse } from "next/server";
import { loginUser } from "@/server/modules/auth";
import { SESSION_COOKIE, sessionCookieOptions } from "@/server/services/session";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  try {
    const result = await loginUser(raw);
    if (!result) {
      return NextResponse.json({ error: "Неверный телефон или пароль" }, { status: 401 });
    }
    const response = NextResponse.json(result.user);
    response.cookies.set(SESSION_COOKIE, result.sessionToken, sessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
