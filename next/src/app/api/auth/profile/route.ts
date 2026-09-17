import { NextResponse } from "next/server";
import { updateProfile } from "@/server/modules/auth";

export async function PATCH(request: Request) {
  const raw = await request.json().catch(() => null);
  try {
    const user = await updateProfile(raw);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    const status = message === "Не авторизован" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}