import { NextResponse } from "next/server";
import {
  DEFAULT_TRANSPORT_SORT,
  type TransportFilters,
  type TransportSort,
} from "@/entities/transport/model";
import { getCurrentUser } from "@/server/modules/auth";
import { createTransport, searchTransports } from "@/server/modules/transports";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(params.get("limit") ?? "10", 10) || 10)
  );
  const filters = parseFilters(params);
  const sort = parseSort(params);
  try {
    const result = await searchTransports(filters, page, limit, sort);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить заявки" },
      { status: 500 }
    );
  }
}

function parseFilters(params: URLSearchParams): TransportFilters {
  const filters: TransportFilters = {};
  const get = (key: string): string => (params.get(key) ?? "").trim();
  if (get("transportType")) filters.transportType = get("transportType");
  if (get("bodyType")) filters.bodyType = get("bodyType");
  const workDistricts = params.get("workDistricts");
  if (workDistricts) {
    const districts = workDistricts
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (districts.length > 0) filters.workDistricts = districts;
  }
  const minLoadCapacity = Number(get("minLoadCapacity"));
  if (Number.isFinite(minLoadCapacity) && minLoadCapacity > 0) {
    filters.minLoadCapacity = minLoadCapacity;
  }
  return filters;
}

function parseSort(params: URLSearchParams): TransportSort {
  const raw = params.get("sort");
  if (!raw) return DEFAULT_TRANSPORT_SORT;
  const colon = raw.indexOf(":");
  const field = colon === -1 ? raw : raw.slice(0, colon);
  const dir = colon === -1 ? "desc" : raw.slice(colon + 1);
  if (
    field === "loadCapacityTons" ||
    field === "minRatePerKm" ||
    field === "createdAt"
  ) {
    return { field, dir: dir === "asc" ? "asc" : "desc" };
  }
  return DEFAULT_TRANSPORT_SORT;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const raw = await request.json().catch(() => null);
  try {
    const transport = await createTransport(raw, currentUser.id);
    return NextResponse.json(transport, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Некорректные данные";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
