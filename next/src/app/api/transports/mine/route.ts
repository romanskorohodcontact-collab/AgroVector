import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { listMyTransports } from "@/server/modules/transports";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  try {
    const items = await listMyTransports(currentUser.id);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Не удалось получить заявки" }, { status: 500 });
  }
}
