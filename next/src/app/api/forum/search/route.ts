import { NextResponse } from "next/server";
import type { ForumSearchType } from "@/entities/forum/model";
import { search } from "@/server/modules/forum";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  const rawType = params.get("type");
  const type: ForumSearchType = rawType === "threads" || rawType === "sections" ? rawType : "all";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.max(1, parseInt(params.get("limit") ?? "10", 10) || 10);
  try {
    const result = await search(query, type, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Не удалось выполнить поиск" }, { status: 500 });
  }
}
