import { NextResponse } from "next/server";
import { getThreadSummaries } from "@/server/modules/forum";

export async function GET() {
  try {
    const summaries = await getThreadSummaries();
    return NextResponse.json(summaries);
  } catch {
    return NextResponse.json({ error: "Не удалось получить темы" }, { status: 500 });
  }
}
