"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint } from "@/entities/load/model";
import {
  loadYmaps,
  toYandexCoords,
  type YmapsApi,
  type YmapsMap,
} from "@/features/map/loadYmaps";
import { LOAD_MARKER_OPTIONS } from "@/features/map/markerIcons";

const DEFAULT_CENTER: GeoPoint = { lat: 55.7558, lng: 37.6173 };
const POINT_ZOOM = 10;
const FALLBACK_ZOOM = 5;

interface LoadDetailMapProps {
  location?: GeoPoint | null;
  className?: string;
}

export function LoadDetailMap({ location, className }: LoadDetailMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let map: YmapsMap | null = null;

    async function init() {
      if (!containerRef.current) return;
      try {
        const ymaps = await loadYmaps();
        await new Promise<void>((resolve) => ymaps.ready(() => resolve()));
        if (cancelled || !containerRef.current) return;
        ymapsRef.current = ymaps;

        const point = location;
        map = new ymaps.Map(containerRef.current, {
          center: toYandexCoords(point ?? DEFAULT_CENTER),
          zoom: point ? POINT_ZOOM : FALLBACK_ZOOM,
          controls: [],
        });
        if (point) {
          map.geoObjects.add(
            new ymaps.Placemark(toYandexCoords(point), LOAD_MARKER_OPTIONS)
          );
        }
        mapRef.current = map;
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (map) {
        map.destroy();
        mapRef.current = null;
      }
    };
  }, [location]);

  return (
    <div className={`relative w-full overflow-hidden bg-bg-subtle ${className ?? ""}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" ? (
        <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-text-muted">
          Загрузка карты…
        </p>
      ) : null}
      {status === "error" ? (
        <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-text-muted">
          Не удалось загрузить карту. Проверьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY.
        </p>
      ) : null}
    </div>
  );
}