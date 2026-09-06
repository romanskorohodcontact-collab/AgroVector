import { NextResponse } from "next/server";
import type { LoadFilters } from "@/entities/load/model";
import { createLoad, searchLoads } from "@/server/modules/loads";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(params.get("limit") ?? "5", 10) || 5)
  );
  const filters = parseFilters(params);
  try {
    const result = await searchLoads(filters, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить заявки" },
      { status: 500 }
    );
  }
}

function parseFilters(params: URLSearchParams): LoadFilters {
  const filters: LoadFilters = {};
  const get = (key: string): string => (params.get(key) ?? "").trim();
  if (get("from")) filters.loadingPlace = get("from");
  if (get("to")) filters.unloadingPlace = get("to");
  if (get("cargo")) filters.cargo = get("cargo");
  if (get("company")) filters.companyName = get("company");
  const tonnage = Number(get("tonnage"));
  if (Number.isFinite(tonnage) && tonnage > 0) filters.minTonnage = tonnage;
  const rate = Number(get("rate"));
  if (Number.isFinite(rate) && rate > 0) filters.minRate = rate;
  const distance = Number(get("distance"));
  if (Number.isFinite(distance) && distance > 0) filters.maxDistance = distance;
  return filters;
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  try {
    const load = await createLoad(raw);
    return NextResponse.json(load, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}