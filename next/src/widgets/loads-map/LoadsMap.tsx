"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint, LoadMapItem } from "@/entities/load/model";
import {
  loadYmaps,
  toYandexCoords,
  type YmapsApi,
  type YmapsMap,
  type YmapsPlacemark,
} from "@/features/map/loadYmaps";

const DEFAULT_CENTER: GeoPoint = { lat: 55.7558, lng: 37.6173 };
const MAP_ZOOM = 5;
const ZOOM_OUT_MARGIN = 2;

interface LoadsMapProps {
  mapItems: LoadMapItem[];
  className?: string;
  onSelect?: (item: LoadMapItem) => void;
  showHoverCard?: boolean;
}

export function LoadsMap({
  mapItems,
  className,
  onSelect,
  showHoverCard = false,
}: LoadsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);
  const mapItemsRef = useRef(mapItems);
  mapItemsRef.current = mapItems;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const showHoverCardRef = useRef(showHoverCard);
  showHoverCardRef.current = showHoverCard;
  const placemarkItemsRef = useRef<Map<YmapsPlacemark, LoadMapItem>>(
    new Map()
  );
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
      placemarkItemsRef.current.clear();
      const points: [number, number][] = [];
      for (const item of mapItemsRef.current) {
        if (!item.loadingLocation) continue;
        const coords = toYandexCoords(item.loadingLocation);
        // Баллун (маленькое окно с названием груза и выгрузкой) отключён.
        // const hasHoverInfo =
        //   showHoverCardRef.current && Boolean(item.cargo);
        // const properties = hasHoverInfo
        //   ? {
        //       balloonContentHeader: item.cargo ?? "",
        //       balloonContentBody: item.unloadingPlace ?? "",
        //     }
        //   : undefined;
        const placemark = new ymaps.Placemark(coords);
        placemarkItemsRef.current.set(placemark, item);
        // if (hasHoverInfo) {
        //   placemark.events.add("mouseenter", () => placemark.balloon.open());
        //   placemark.events.add("mouseleave", () => placemark.balloon.close());
        // }
        if (onSelectRef.current) {
          placemark.events.add("click", () => onSelectRef.current?.(item));
          placemark.events.add("tap", () => onSelectRef.current?.(item));
        }
        mapInstance.geoObjects.add(placemark);
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
        map.events.add("click", (event) => {
          const target = event.get("target");
          for (const [placemark, item] of placemarkItemsRef.current) {
            if (target === placemark) {
              onSelectRef.current?.(item);
              return;
            }
          }
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