import { NextResponse } from "next/server";
import { getThread } from "@/server/modules/forum";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const thread = await getThread(id);
    if (!thread) {
      return NextResponse.json({ error: "Тема не найдена" }, { status: 404 });
    }
    return NextResponse.json(thread);
  } catch {
    return NextResponse.json({ error: "Не удалось получить тему" }, { status: 500 });
  }
}
