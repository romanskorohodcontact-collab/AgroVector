import { NextResponse } from "next/server";
import { getHomeData } from "@/server/modules/forum";

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Не удалось получить данные форума" }, { status: 500 });
  }
}
