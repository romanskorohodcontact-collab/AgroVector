import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { getLoad, updateLoad } from "@/server/modules/loads";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const load = await getLoad(id);
  if (!load) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  return NextResponse.json(load);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const raw = await request.json().catch(() => null);
  try {
    const load = await updateLoad(raw, id, currentUser.id);
    if (!load) {
      return NextResponse.json(
        { error: "Заявка не найдена или недоступна" },
        { status: 404 }
      );
    }
    return NextResponse.json(load);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}