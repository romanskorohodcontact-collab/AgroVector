"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint, LoadMapItem } from "@/entities/load/model";
import {
  loadYmaps,
  toYandexCoords,
  type YmapsApi,
  type YmapsMap,
} from "@/features/map/loadYmaps";

const DEFAULT_CENTER: GeoPoint = { lat: 55.7558, lng: 37.6173 };
const MAP_ZOOM = 5;
const ZOOM_OUT_MARGIN = 2;

interface LoadsMapProps {
  mapItems: LoadMapItem[];
}

export function LoadsMap({ mapItems }: LoadsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);
  const mapItemsRef = useRef(mapItems);
  mapItemsRef.current = mapItems;
  const renderRef = useRef<() => void>(() => {});

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let map: YmapsMap | null = null;

    function renderMarkers() {
      const mapInstance = mapRef.current;
      const ymaps = ymapsRef.current;
      if (!mapInstance || !ymaps) return;
      mapInstance.geoObjects.removeAll();
      const points: [number, number][] = [];
      for (const item of mapItemsRef.current) {
        if (!item.loadingLocation) continue;
        const coords = toYandexCoords(item.loadingLocation);
        mapInstance.geoObjects.add(new ymaps.Placemark(coords));
        points.push(coords);
      }
      if (points.length > 0) {
        mapInstance.setBounds(ymaps.util.bounds.fromPoints(points));
        mapInstance.setZoom(mapInstance.getZoom() - ZOOM_OUT_MARGIN);
      } else {
        mapInstance.setCenter(toYandexCoords(DEFAULT_CENTER), MAP_ZOOM);
      }
    }

    renderRef.current = renderMarkers;

    async function init() {
      if (!containerRef.current) return;
      try {
        const ymaps = await loadYmaps();
        await new Promise<void>((resolve) => ymaps.ready(() => resolve()));
        if (cancelled || !containerRef.current) return;
        ymapsRef.current = ymaps;

        map = new ymaps.Map(containerRef.current, {
          center: toYandexCoords(DEFAULT_CENTER),
          zoom: MAP_ZOOM,
          controls: [],
        });
        mapRef.current = map;
        renderMarkers();
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
  }, []);

  useEffect(() => {
    renderRef.current();
  }, [mapItems]);

  return (
    <div style={{ margin: "16px" }}>
      <div ref={containerRef} className="h-96 w-full border border-black" />
      {status === "loading" ? (
        <p className="mt-2">Загрузка карты…</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2">
          Не удалось загрузить карту. Проверьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY.
        </p>
      ) : null}
    </div>
  );
}