import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  return NextResponse.json(user);
}