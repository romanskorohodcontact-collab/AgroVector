import {
  DEFAULT_TRANSPORT_SORT,
  type Transport,
  type TransportFilters,
  type TransportSearchResult,
  type TransportSort,
  type TransportSortField,
  type SortDirection,
} from "@/entities/transport/model";
import { Types } from "mongoose";
import { connectDb } from "@/server/db/connection";
import { TransportModel, type TransportFields } from "@/server/db/models/transport";
import type { QueryFilter } from "mongoose";

export type TransportInputData = Omit<CreateTransportData, "userId">;

export interface CreateTransportData {
  userId: string;
  transportType: string;
  bodyType: string;
  loadCapacityTons: number | null;
  bodyVolumeM3: number | null;
  cargoTypes: string[];
  loadingType: string[] | null;
  unloadingType: string[] | null;
  workRegions: string[] | null;
  workDistricts: string[];
  minRatePerKm: number | null;
  minTripRate: number | null;
  vatType: string;
  availability: {
    type: string;
    date: Date | null;
  };
  transportLocation: {
    lat: number;
    lng: number;
  };
  additionalInfo: string;
  contactName: string;
  contactPhone: string;
}

interface TransportRecord extends CreateTransportData {
  _id: Types.ObjectId;
}

export async function getTransportById(id: string): Promise<Transport | null> {
  await connectDb();
  const doc = await TransportModel.findById(toObjectId(id)).lean();
  return doc ? toTransport(doc as unknown as TransportRecord) : null;
}

export async function createTransport(data: CreateTransportData): Promise<Transport> {
  await connectDb();
  const doc = await TransportModel.create(toCreateQuery(data));
  return toTransport(doc.toObject() as unknown as TransportRecord);
}

export async function listTransports(filters: TransportFilters = {}): Promise<Transport[]> {
  await connectDb();
  const docs = (await TransportModel.find(buildTransportQuery(filters))
    .sort({ createdAt: -1 })
    .lean()) as unknown as TransportRecord[];
  return docs.map(toTransport);
}

export async function listTransportsByUser(userId: string): Promise<Transport[]> {
  await connectDb();
  const docs = (await TransportModel.find({ userId: toObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean()) as unknown as TransportRecord[];
  return docs.map(toTransport);
}

export async function getOwnTransport(
  id: string,
  userId: string
): Promise<Transport | null> {
  await connectDb();
  const doc = await TransportModel.findOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  }).lean();
  return doc ? toTransport(doc as unknown as TransportRecord) : null;
}

export async function updateOwnTransport(
  id: string,
  userId: string,
  data: TransportInputData
): Promise<Transport | null> {
  await connectDb();
  const doc = await TransportModel.findOneAndUpdate(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set: data },
    { new: true }
  ).lean();
  return doc ? toTransport(doc as unknown as TransportRecord) : null;
}

export async function deleteOwnTransport(
  id: string,
  userId: string
): Promise<boolean> {
  await connectDb();
  const result = await TransportModel.deleteOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  });
  return result.deletedCount > 0;
}

export async function searchTransports(
  filters: TransportFilters,
  page: number,
  limit: number,
  sort: TransportSort = DEFAULT_TRANSPORT_SORT
): Promise<TransportSearchResult> {
  await connectDb();
  const query = buildTransportQuery(filters);
  const [total, itemDocs] = await Promise.all([
    TransportModel.countDocuments(query),
    fetchSortedTransports(query, sort, page, limit),
  ]);

  return {
    items: (itemDocs as unknown as TransportRecord[]).map(toTransport),
    total,
  };
}

function buildTransportQuery(filters: TransportFilters): QueryFilter<TransportFields> {
  const query: QueryFilter<TransportFields> = {};
  if (filters.transportType) {
    query.transportType = { $eq: filters.transportType };
  }
  if (filters.bodyType) {
    query.bodyType = { $eq: filters.bodyType };
  }
  if (filters.workDistricts && filters.workDistricts.length > 0) {
    query.workDistricts = { $in: filters.workDistricts };
  }
  if (filters.minLoadCapacity != null) {
    query.loadCapacityTons = { $gte: filters.minLoadCapacity };
  }
  return query;
}

function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}

function toCreateQuery(data: CreateTransportData) {
  return { ...data, userId: toObjectId(data.userId) };
}

const SORT_FIELDS: Record<TransportSortField, string> = {
  loadCapacityTons: "loadCapacityTons",
  minRatePerKm: "minRatePerKm",
  createdAt: "createdAt",
};

function toSortQuery(
  field: TransportSortField,
  dir: SortDirection
): Record<string, 1 | -1> {
  return { [SORT_FIELDS[field]]: dir === "asc" ? 1 : -1 };
}

async function fetchSortedTransports(
  query: QueryFilter<TransportFields>,
  sort: TransportSort,
  page: number,
  limit: number
): Promise<TransportRecord[]> {
  return (await TransportModel.find(query)
    .sort(toSortQuery(sort.field, sort.dir))
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()) as unknown as TransportRecord[];
}

function toStringArray(value: string[] | null | undefined): string[] {
  return value ?? [];
}

function toTransport(doc: TransportRecord): Transport {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : "",
    transportType: doc.transportType,
    bodyType: doc.bodyType,
    loadCapacityTons: doc.loadCapacityTons,
    bodyVolumeM3: doc.bodyVolumeM3,
    cargoTypes: toStringArray(doc.cargoTypes),
    loadingType: doc.loadingType,
    unloadingType: doc.unloadingType,
    workRegions: doc.workRegions,
    workDistricts: toStringArray(doc.workDistricts),
    minRatePerKm: doc.minRatePerKm,
    minTripRate: doc.minTripRate,
    vatType: doc.vatType,
    availability: {
      type: doc.availability.type,
      date: doc.availability.date,
    },
    transportLocation: doc.transportLocation,
    additionalInfo: doc.additionalInfo ?? "",
    contactName: doc.contactName,
    contactPhone: doc.contactPhone,
  };
}
