import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { replyToThread } from "@/server/modules/forum";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const raw = await request.json().catch(() => null);
  try {
    const post = await replyToThread(id, raw, currentUser);
    if (!post) {
      return NextResponse.json({ error: "Тема не найдена" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
