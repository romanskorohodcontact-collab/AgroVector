import type { GeoPoint } from "@/entities/load/model";

export interface YmapsIconLayout {
  image: string;
  iconSize: [number, number];
  iconOffset: [number, number];
}

export interface YmapsIconShape {
  type: "Rectangle";
  coordinates: [number, number, number, number];
  fill: string;
}

export interface YmapsPlacemarkOptions {
  iconLayout?: YmapsIconLayout;
  iconShape?: YmapsIconShape;
}

export interface YmapsEvent {
  get: {
    (name: "coords"): [number, number];
    (name: string): unknown;
  };
}

export interface YmapsPlacemark {
  events: {
    add: (type: string, handler: (event: YmapsEvent) => void) => void;
  };
  balloon: {
    open: () => void;
    close: () => void;
  };
}

export interface YmapsCluster {
  events: {
    add: (type: string, handler: (event: YmapsEvent) => void) => void;
  };
  getGeoObjects: () => YmapsPlacemark[];
  getBounds: () => unknown;
}

export interface YmapsClusterer {
  add: (object: YmapsPlacemark) => YmapsClusterer;
  removeAll: () => YmapsClusterer;
  getObjectState: (object: YmapsPlacemark) => {
    isShown: boolean;
    isClustered: boolean;
  };
  createCluster?: (center?: unknown, geoObjects?: YmapsPlacemark[]) => YmapsCluster;
}

export interface YmapsMap {
  events: {
    add: (type: string, handler: (event: YmapsEvent) => void) => void;
  };
  geoObjects: {
    add: (object: YmapsPlacemark | YmapsClusterer) => void;
    remove: (object: YmapsPlacemark | YmapsClusterer) => void;
    removeAll: () => void;
  };
  setBounds: (bounds: unknown, options?: Record<string, unknown>) => void;
  setCenter: (center: [number, number], zoom?: number) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  destroy: () => void;
}

export interface YmapsTemplateLayoutFactory {
  createClass: (name: string, proto: Record<string, unknown>) => unknown;
}

export interface YmapsApi {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    state: { center: [number, number]; zoom: number; controls?: unknown[] },
  ) => YmapsMap;
  Placemark: new (
    coordinates: [number, number],
    options?: Record<string, unknown> | YmapsPlacemarkOptions,
    properties?: Record<string, string>,
  ) => YmapsPlacemark;
  Clusterer: new (options?: Record<string, unknown>) => YmapsClusterer;
  templateLayoutFactory: YmapsTemplateLayoutFactory;
  util: {
    bounds: {
      fromPoints: (points: [number, number][]) => unknown;
    };
  };
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

let ymapsPromise: Promise<YmapsApi> | null = null;

export function loadYmaps(): Promise<YmapsApi> {
  const win = window as Window & { ymaps?: YmapsApi };
  const existing = win.ymaps;
  if (existing) return Promise.resolve(existing);
  if (!ymapsPromise) {
    ymapsPromise = new Promise<YmapsApi>((resolve, reject) => {
      const url =
        "https://api-maps.yandex.ru/2.1/?" +
        new URLSearchParams({ apikey: API_KEY ?? "", lang: "ru_RU" });
      const finish = () => {
        const api = win.ymaps;
        if (api) resolve(api);
        else reject(new Error("Yandex Maps API не загрузилась"));
      };
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`);
      const script: HTMLScriptElement = existingScript ?? document.createElement("script");
      script.onload = finish;
      script.onerror = () => reject(new Error("script load error"));
      if (!existingScript) {
        script.src = url;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }
  return ymapsPromise;
}

export function toYandexCoords(point: GeoPoint): [number, number] {
  return [point.lat, point.lng];
}

export function toGeoPoint(coords: [number, number]): GeoPoint {
  return { lat: coords[0], lng: coords[1] };
}
