import type {
  GeoPoint,
  Load,
  LoadFilters,
  LoadMapItem,
  LoadSearchResult,
} from "@/entities/load/model";
import { connectDb } from "@/server/db/connection";
import { LoadModel, type LoadFields } from "@/server/db/models/load";
import type { QueryFilter } from "mongoose";

export interface CreateLoadData {
  loadingPlace: string;
  loadingLocation: GeoPoint;
  unloadingPlace: string;
  distance: number;
  rate: number;
  tonnage: number;
  cargo: string;
  additionalInfo: string;
  customerName: string;
  customerPhone: string;
  companyName: string;
}

interface LoadRecord extends CreateLoadData {
  _id: { toString(): string };
}

interface MapRecord {
  _id: { toString(): string };
  loadingLocation: GeoPoint;
}

export async function createLoad(data: CreateLoadData): Promise<Load> {
  await connectDb();
  const doc = await LoadModel.create(data);
  return toLoad(doc.toObject() as unknown as LoadRecord);
}

export async function listLoads(filters: LoadFilters = {}): Promise<Load[]> {
  await connectDb();
  const docs = (await LoadModel.find(buildLoadQuery(filters))
    .sort({ createdAt: -1 })
    .lean()) as unknown as LoadRecord[];
  return docs.map(toLoad);
}

export async function searchLoads(
  filters: LoadFilters,
  page: number,
  limit: number
): Promise<LoadSearchResult> {
  await connectDb();
  const query = buildLoadQuery(filters);
  const [
    total,
    itemDocs,
    mapDocs,
    loadingPlaces,
    unloadingPlaces,
    cargoValues,
    companyNames,
  ] = await Promise.all([
    LoadModel.countDocuments(query),
    LoadModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    LoadModel.find(query).select({ _id: 1, loadingLocation: 1 }).lean(),
    LoadModel.distinct("loadingPlace"),
    LoadModel.distinct("unloadingPlace"),
    LoadModel.distinct("cargo"),
    LoadModel.distinct("companyName"),
  ]);

  return {
    items: (itemDocs as unknown as LoadRecord[]).map(toLoad),
    mapItems: (mapDocs as unknown as MapRecord[]).map(toMapItem),
    suggestions: {
      loadingPlaces: toStrings(loadingPlaces),
      unloadingPlaces: toStrings(unloadingPlaces),
      cargo: toStrings(cargoValues),
      companyNames: toStrings(companyNames),
    },
    total,
  };
}

function buildLoadQuery(filters: LoadFilters): QueryFilter<LoadFields> {
  const query: QueryFilter<LoadFields> = {};
  const text = (value?: string): string | undefined =>
    value ? escapeRegex(value) : undefined;
  if (text(filters.loadingPlace)) {
    query.loadingPlace = { $regex: text(filters.loadingPlace), $options: "i" };
  }
  if (text(filters.unloadingPlace)) {
    query.unloadingPlace = {
      $regex: text(filters.unloadingPlace),
      $options: "i",
    };
  }
  if (text(filters.cargo)) {
    query.cargo = { $regex: text(filters.cargo), $options: "i" };
  }
  if (filters.companyName) {
    query.companyName = { $eq: filters.companyName };
  }
  if (filters.minTonnage != null) {
    query.tonnage = { $gte: filters.minTonnage };
  }
  if (filters.minRate != null) {
    query.rate = { $gte: filters.minRate };
  }
  if (filters.maxDistance != null) {
    query.distance = { $lte: filters.maxDistance };
  }
  return query;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toStrings(values: unknown[]): string[] {
  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .sort();
}

function toMapItem(doc: MapRecord): LoadMapItem {
  return {
    id: doc._id.toString(),
    loadingLocation: doc.loadingLocation,
  };
}

function toLoad(doc: LoadRecord): Load {
  return {
    id: doc._id.toString(),
    loadingPlace: doc.loadingPlace,
    loadingLocation: doc.loadingLocation,
    unloadingPlace: doc.unloadingPlace,
    distance: doc.distance,
    rate: doc.rate,
    tonnage: doc.tonnage,
    cargo: doc.cargo,
    additionalInfo: doc.additionalInfo ?? "",
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    companyName: doc.companyName,
  };
}