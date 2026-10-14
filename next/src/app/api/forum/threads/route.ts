import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { createThread, getSectionPage } from "@/server/modules/forum";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const section = (params.get("section") ?? "").trim();
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(params.get("limit") ?? "10", 10) || 10));
  try {
    const result = await getSectionPage(section, page, limit);
    if (!result) {
      return NextResponse.json({ error: "Раздел не найден" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Не удалось получить темы" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const raw = await request.json().catch(() => null);
  try {
    const thread = await createThread(raw, currentUser);
    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
