import { NextResponse } from "next/server";
import {
  DEFAULT_TRANSPORT_SORT,
  type TransportFilters,
  type TransportSort,
} from "@/entities/transport/model";
import { getCurrentUser } from "@/server/modules/auth";
import { createTransport, getTransportsByIds, searchTransports } from "@/server/modules/transports";

const MAX_IDS = 100;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const idsRaw = params.get("ids");
  if (idsRaw) {
    const ids = idsRaw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, MAX_IDS);
    try {
      const transports = await getTransportsByIds(ids);
      return NextResponse.json(transports);
    } catch {
      return NextResponse.json({ error: "Не удалось получить заявки" }, { status: 500 });
    }
  }
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(params.get("limit") ?? "10", 10) || 10));
  const filters = parseFilters(params);
  const sort = parseSort(params);
  try {
    const result = await searchTransports(filters, page, limit, sort);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Не удалось получить заявки" }, { status: 500 });
  }
}

function parseFilters(params: URLSearchParams): TransportFilters {
  const filters: TransportFilters = {};
  const getArray = (key: string): string[] => {
    const raw = params.get(key);
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };
  const bodyTypes = getArray("bodyTypes");
  if (bodyTypes.length > 0) filters.bodyTypes = bodyTypes;
  const loadingTypes = getArray("loadingTypes");
  if (loadingTypes.length > 0) filters.loadingTypes = loadingTypes;
  const vatTypes = getArray("vatTypes");
  if (vatTypes.length > 0) filters.vatTypes = vatTypes;
  const cargoTypes = getArray("cargoTypes");
  if (cargoTypes.length > 0) filters.cargoTypes = cargoTypes;
  const workRegions = getArray("workRegions");
  if (workRegions.length > 0) filters.workRegions = workRegions;
  const maxRatePerKm = Number((params.get("maxRatePerKm") ?? "").trim());
  if (Number.isFinite(maxRatePerKm) && maxRatePerKm > 0) {
    filters.maxRatePerKm = maxRatePerKm;
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
    field === "bodyVolumeM3" ||
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
