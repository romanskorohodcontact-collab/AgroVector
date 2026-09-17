import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { deleteTransport, getTransport, updateTransport } from "@/server/modules/transports";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const transport = await getTransport(id);
  if (!transport) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  return NextResponse.json(transport);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const raw = await request.json().catch(() => null);
  try {
    const transport = await updateTransport(raw, id, currentUser.id);
    if (!transport) {
      return NextResponse.json(
        { error: "Заявка не найдена или недоступна" },
        { status: 404 }
      );
    }
    return NextResponse.json(transport);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deleteTransport(id, currentUser.id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Заявка не найдена или недоступна" },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
