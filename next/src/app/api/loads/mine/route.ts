import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/modules/auth";
import { listMyLoads } from "@/server/modules/loads";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  try {
    const items = await listMyLoads(currentUser.id);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить заявки" },
      { status: 500 }
    );
  }
}