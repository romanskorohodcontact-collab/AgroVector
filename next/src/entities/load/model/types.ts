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
}

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

export interface Load {
  id: string;
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
