"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint } from "@/entities/load/model";
import {
  loadYmaps,
  toGeoPoint,
  toYandexCoords,
  type YmapsApi,
  type YmapsMap,
  type YmapsPlacemark,
} from "@/features/map/loadYmaps";

const DEFAULT_CENTER: GeoPoint = { lat: 55.7558, lng: 37.6173 };

interface MapPickerProps {
  initialLocation?: GeoPoint | null;
  onSelect: (location: GeoPoint) => void;
  className?: string;
}

export function MapPicker({ initialLocation, onSelect, className }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);
  const placemarkRef = useRef<YmapsPlacemark | null>(null);
  const onSelectRef = useRef(onSelect);
  const initialRef = useRef(initialLocation ?? null);
  onSelectRef.current = onSelect;

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<GeoPoint | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: YmapsMap | null = null;

    function setPlacemark(point: GeoPoint) {
      const mapInstance = mapRef.current;
      const ymaps = ymapsRef.current;
      if (!mapInstance || !ymaps) return;
      if (placemarkRef.current) {
        mapInstance.geoObjects.remove(placemarkRef.current);
      }
      placemarkRef.current = new ymaps.Placemark(toYandexCoords(point));
      mapInstance.geoObjects.add(placemarkRef.current);
    }

    async function init() {
      if (!containerRef.current) return;
      try {
        const ymaps = await loadYmaps();
        await new Promise<void>((resolve) => ymaps.ready(() => resolve()));
        if (cancelled || !containerRef.current) return;
        ymapsRef.current = ymaps;

        const start = initialRef.current ?? DEFAULT_CENTER;
        map = new ymaps.Map(containerRef.current, {
          center: toYandexCoords(start),
          zoom: 10,
          controls: [],
        });
        map.events.add("click", (event) => {
          const point = toGeoPoint(event.get("coords"));
          setSelected(point);
          setPlacemark(point);
          onSelectRef.current(point);
        });
        mapRef.current = map;

        if (initialRef.current) {
          setSelected(initialRef.current);
          setPlacemark(initialRef.current);
        }
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

  return (
    <div>
      <div ref={containerRef} className={className ?? "h-64 w-full border border-black"} />
      {status === "loading" ? (
        <p className="mt-2">Загрузка карты…</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2">
          Не удалось загрузить карту. Проверьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY:
          ключ должен быть создан для «JavaScript API» (v2.1).
        </p>
      ) : null}
      {selected ? (
        <p className="mt-2">
          Широта: {selected.lat.toFixed(5)}, Долгота: {selected.lng.toFixed(5)}
        </p>
      ) : null}
    </div>
  );
}