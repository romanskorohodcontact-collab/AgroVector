import { NextResponse } from "next/server";
import { logoutUser } from "@/server/modules/auth";
import { SESSION_COOKIE } from "@/server/services/session";

export async function POST() {
  await logoutUser();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}