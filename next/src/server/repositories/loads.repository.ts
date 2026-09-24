import {
  DEFAULT_LOAD_SORT,
  type GeoPoint,
  type Load,
  type LoadFilters,
  type LoadMapItem,
  type LoadSearchResult,
  type LoadSort,
  type LoadSortField,
  type SortDirection,
} from "@/entities/load/model";
import { Types } from "mongoose";
import { connectDb } from "@/server/db/connection";
import { LoadModel, type LoadFields } from "@/server/db/models/load";
import type { QueryFilter } from "mongoose";

export type LoadInputData = Omit<CreateLoadData, "userId">;

export interface CreateLoadData {
  userId: string;
  loadingPlace: string;
  loadingLocation: GeoPoint;
  unloadingPlace: string;
  distance: number;
  rate: number;
  ratePerKm: number;
  tonnage: {
    tonnageWeight: number;
    tonnageUnit: "kg" | "ton";
  };
  bodyType: string;
  cargo: string;
  cargoForm: string;
  cargoTypes: string[];
  additionalInfo: string;
  customerName: string;
  customerPhone: string;
  companyName: string;
  loadingRegion: string[] | null;
  loadingDistrict: string[];
  unloadingDistrict: string[];
  unloadingRegion: string[] | null;
  loadingType: string[] | null;
  unloadingType: string[] | null;
  vatType: string;
  loadingDate: Date;
  customProperties: { name: string; value: string }[];
}

interface LoadRecord extends CreateLoadData {
  _id: Types.ObjectId;
}

interface MapRecord {
  _id: { toString(): string };
  loadingLocation: GeoPoint;
  cargo?: string;
  unloadingPlace?: string;
}

export async function getLoadById(id: string): Promise<Load | null> {
  await connectDb();
  const doc = await LoadModel.findById(toObjectId(id)).lean();
  return doc ? toLoad(doc as unknown as LoadRecord) : null;
}

export async function getLoadsByIds(ids: string[]): Promise<Load[]> {
  await connectDb();
  const objectIds = ids
    .map((id) => {
      try {
        return toObjectId(id);
      } catch {
        return null;
      }
    })
    .filter((value): value is Types.ObjectId => value !== null);
  if (objectIds.length === 0) return [];
  const docs = (await LoadModel.find({ _id: { $in: objectIds } })
    .lean()) as unknown as LoadRecord[];
  return docs.map(toLoad);
}

export async function createLoad(data: CreateLoadData): Promise<Load> {
  await connectDb();
  const doc = await LoadModel.create(toCreateQuery(data));
  return toLoad(doc.toObject() as unknown as LoadRecord);
}

export async function listLoads(filters: LoadFilters = {}): Promise<Load[]> {
  await connectDb();
  const docs = (await LoadModel.find(buildLoadQuery(filters))
    .sort({ createdAt: -1 })
    .lean()) as unknown as LoadRecord[];
  return docs.map(toLoad);
}

export async function listLoadsByUser(userId: string): Promise<Load[]> {
  await connectDb();
  const docs = (await LoadModel.find({ userId: toObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean()) as unknown as LoadRecord[];
  return docs.map(toLoad);
}

export async function getOwnLoad(
  id: string,
  userId: string
): Promise<Load | null> {
  await connectDb();
  const doc = await LoadModel.findOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  }).lean();
  return doc ? toLoad(doc as unknown as LoadRecord) : null;
}

export async function updateOwnLoad(
  id: string,
  userId: string,
  data: LoadInputData
): Promise<Load | null> {
  await connectDb();
  const doc = await LoadModel.findOneAndUpdate(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set: data },
    { new: true }
  ).lean();
  return doc ? toLoad(doc as unknown as LoadRecord) : null;
}

export async function searchLoads(
  filters: LoadFilters,
  page: number,
  limit: number,
  sort: LoadSort = DEFAULT_LOAD_SORT
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
    fetchSortedItems(query, sort, page, limit),
    LoadModel.find(query)
      .select({ _id: 1, loadingLocation: 1, cargo: 1, unloadingPlace: 1 })
      .lean(),
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
    query["tonnage.tonnageWeight"] = { $gte: filters.minTonnage };
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

function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}

function toCreateQuery(data: CreateLoadData) {
  return { ...data, userId: toObjectId(data.userId) };
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
    cargo: doc.cargo ?? "",
    unloadingPlace: doc.unloadingPlace ?? "",
  };
}

const SORT_FIELDS: Record<Exclude<LoadSortField, "ratePerKm">, string> = {
  rate: "rate",
  km: "distance",
  tons: "tonnage.tonnageWeight",
};

function toSortQuery(
  field: Exclude<LoadSortField, "ratePerKm">,
  dir: SortDirection
): Record<string, 1 | -1> {
  return { [SORT_FIELDS[field]]: dir === "asc" ? 1 : -1 };
}

async function fetchSortedItems(
  query: QueryFilter<LoadFields>,
  sort: LoadSort,
  page: number,
  limit: number
): Promise<LoadRecord[]> {
  if (sort.field === "ratePerKm") {
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          __ratePerKm: { $divide: ["$rate", "$distance"] },
        },
      },
      { $sort: { __ratePerKm: (sort.dir === "asc" ? 1 : -1) as 1 | -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];
    return (await LoadModel.aggregate(pipeline)) as unknown as LoadRecord[];
  }
  return (await LoadModel.find(query)
    .sort(toSortQuery(sort.field, sort.dir))
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()) as unknown as LoadRecord[];
}

function toLoad(doc: LoadRecord): Load {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : "",
    loadingPlace: doc.loadingPlace,
    loadingLocation: doc.loadingLocation,
    unloadingPlace: doc.unloadingPlace,
    distance: doc.distance,
    rate: doc.rate,
    ratePerKm: doc.ratePerKm ?? (doc.distance > 0 ? doc.rate / doc.distance : 0),
    tonnage: doc.tonnage ?? { tonnageWeight: 0, tonnageUnit: "ton" },
    bodyType: doc.bodyType ?? "",
    cargo: doc.cargo,
    cargoForm: doc.cargoForm ?? "",
    cargoTypes: doc.cargoTypes ?? [],
    additionalInfo: doc.additionalInfo ?? "",
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    companyName: doc.companyName,
    loadingRegion: doc.loadingRegion ?? null,
    loadingDistrict: doc.loadingDistrict ?? [],
    unloadingDistrict: doc.unloadingDistrict ?? [],
    unloadingRegion: doc.unloadingRegion ?? null,
    loadingType: doc.loadingType ?? null,
    unloadingType: doc.unloadingType ?? null,
    vatType: doc.vatType,
    loadingDate: doc.loadingDate ?? new Date(0),
    customProperties: doc.customProperties ?? [],
  };
}