export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface LoadFilters {
  loadingPlace?: string;
  unloadingPlace?: string;
  cargo?: string;
  companyName?: string;
  minTonnage?: number;
  minRate?: number;
  maxDistance?: number;
}

export interface LoadMapItem {
  id: string;
  loadingLocation: GeoPoint;
  cargo?: string;
  unloadingPlace?: string;
}

export type LoadSortField = "rate" | "km" | "tons" | "ratePerKm";
export type SortDirection = "asc" | "desc";

export interface LoadSortCriterion {
  field: LoadSortField;
  dir: SortDirection;
}

export type LoadSort = LoadSortCriterion;

export const DEFAULT_LOAD_SORT: LoadSort = { field: "rate", dir: "desc" };

export interface LoadSuggestions {
  loadingPlaces: string[];
  unloadingPlaces: string[];
  cargo: string[];
  companyNames: string[];
}

export interface LoadSearchResult {
  items: Load[];
  mapItems: LoadMapItem[];
  suggestions: LoadSuggestions;
  total: number;
}

export interface SearchFiltersValues {
  from?: string;
  to?: string;
  cargo?: string;
  tonnage?: string;
  rate?: string;
  distance?: string;
  company?: string;
}

export interface LoadCustomProperty {
  name: string;
  value: string;
}

export interface Tonnage {
  tonnageWeight: number;
  tonnageUnit: "kg" | "ton";
}

export interface Load {
  id: string;
  userId?: string;
  loadingPlace: string;
  loadingLocation: GeoPoint;
  unloadingPlace: string;
  distance: number;
  rate: number;
  ratePerKm: number;
  tonnage: Tonnage;
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
  customProperties: LoadCustomProperty[];
}
