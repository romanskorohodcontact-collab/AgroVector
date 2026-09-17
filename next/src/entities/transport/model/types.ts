export interface TransportAvailability {
  type: string;
  date: Date | null;
}

export interface TransportFilters {
  transportType?: string;
  bodyType?: string;
  workDistricts?: string[];
  minLoadCapacity?: number;
}

export type TransportSortField = "loadCapacityTons" | "minRatePerKm" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface TransportSortCriterion {
  field: TransportSortField;
  dir: SortDirection;
}

export type TransportSort = TransportSortCriterion;

export const DEFAULT_TRANSPORT_SORT: TransportSort = { field: "createdAt", dir: "desc" };

export interface TransportSearchResult {
  items: Transport[];
  total: number;
}

export interface Transport {
  id: string;
  userId?: string;
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
  availability: TransportAvailability;
  transportLocation: { lat: number; lng: number };
  additionalInfo: string;
  contactName: string;
  contactPhone: string;
}
