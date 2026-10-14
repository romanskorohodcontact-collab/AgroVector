"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPoint, LoadMapItem } from "@/entities/load/model";
import {
  loadYmaps,
  toYandexCoords,
  type YmapsApi,
  type YmapsCluster,
  type YmapsClusterer,
  type YmapsMap,
  type YmapsPlacemark,
} from "@/features/map/loadYmaps";
import { createClusterLayout } from "@/features/map/clusterLayout";
import { LOAD_MARKER_FILL, LOAD_MARKER_OPTIONS } from "@/features/map/markerIcons";

const DEFAULT_CENTER: GeoPoint = { lat: 55.7558, lng: 37.6173 };
const MAP_ZOOM = 5;
const ZOOM_OUT_MARGIN = 2;
const OUTSIDER_DEBOUNCE_MS = 150;

interface LoadsMapProps {
  mapItems: LoadMapItem[];
  className?: string;
  onSelect?: (item: LoadMapItem) => void;
  showHoverCard?: boolean;
  onClusterChange?: (itemIds: string[]) => void;
  activeClusterFilter?: string[] | null;
}

export function LoadsMap({
  mapItems,
  className,
  onSelect,
  showHoverCard = false,
  onClusterChange,
  activeClusterFilter,
}: LoadsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const ymapsRef = useRef<YmapsApi | null>(null);
  const clustererRef = useRef<YmapsClusterer | null>(null);
  const mapItemsRef = useRef(mapItems);
  mapItemsRef.current = mapItems;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const showHoverCardRef = useRef(showHoverCard);
  showHoverCardRef.current = showHoverCard;
  const onClusterChangeRef = useRef(onClusterChange);
  onClusterChangeRef.current = onClusterChange;
  const placemarkItemsRef = useRef<Map<YmapsPlacemark, LoadMapItem>>(new Map());
  const activeClusterFilterRef = useRef<string[] | null>(null);
  activeClusterFilterRef.current = activeClusterFilter ?? null;
  const outsiderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderRef = useRef<() => void>(() => {});

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let map: YmapsMap | null = null;

    function clearOutsiderTimer() {
      if (outsiderTimerRef.current) {
        clearTimeout(outsiderTimerRef.current);
        outsiderTimerRef.current = null;
      }
    }

    function checkOutsiders() {
      const mapInstance = mapRef.current;
      const clusterer = clustererRef.current;
      if (!mapInstance || !clusterer) return;
      const filter = activeClusterFilterRef.current;
      if (!filter || filter.length === 0) return;
      const filterSet = new Set(filter);
      for (const [placemark, item] of placemarkItemsRef.current) {
        if (filterSet.has(item.id)) continue;
        try {
          const state = clusterer.getObjectState(placemark);
          if (state.isShown && !state.isClustered) {
            activeClusterFilterRef.current = null;
            onClusterChangeRef.current?.([]);
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    function scheduleOutsiderCheck() {
      clearOutsiderTimer();
      outsiderTimerRef.current = setTimeout(checkOutsiders, OUTSIDER_DEBOUNCE_MS);
    }

    function renderMarkers() {
      const clusterer = clustererRef.current;
      if (!clusterer) return;
      clusterer.removeAll();
      placemarkItemsRef.current.clear();
      const points: [number, number][] = [];
      for (const item of mapItemsRef.current) {
        if (!item.loadingLocation) continue;
        const coords = toYandexCoords(item.loadingLocation);
        const placemark = new ymapsRef.current!.Placemark(coords, LOAD_MARKER_OPTIONS);
        placemarkItemsRef.current.set(placemark, item);
        if (onSelectRef.current) {
          placemark.events.add("click", () => onSelectRef.current?.(item));
          placemark.events.add("tap", () => onSelectRef.current?.(item));
        }
        clusterer.add(placemark);
        points.push(coords);
      }
      const mapInstance = mapRef.current;
      if (mapInstance && !activeClusterFilterRef.current) {
        if (points.length > 0) {
          mapInstance.setBounds(ymapsRef.current!.util.bounds.fromPoints(points));
          mapInstance.setZoom(mapInstance.getZoom() - ZOOM_OUT_MARGIN);
        } else {
          mapInstance.setCenter(toYandexCoords(DEFAULT_CENTER), MAP_ZOOM);
        }
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
        const clusterer = new ymaps.Clusterer({
          clusterLayout: createClusterLayout(ymaps, LOAD_MARKER_FILL),
          clusterDisableClickZoom: true,
          hasBalloon: false,
          hasHint: false,
          zoomMargin: 48,
        });
        const prototypeCreateCluster = (
          ymaps.Clusterer as unknown as {
            prototype: {
              createCluster: (center?: unknown, geoObjects?: YmapsPlacemark[]) => YmapsCluster;
            };
          }
        ).prototype.createCluster;
        clusterer.createCluster = function (center, geoObjects) {
          const cluster = prototypeCreateCluster.call(this, center, geoObjects);
          cluster.events.add("click", () => {
            const members = cluster.getGeoObjects();
            const ids: string[] = [];
            const coordKeys = new Set<string>();
            for (const member of members) {
              for (const [placemark, item] of placemarkItemsRef.current) {
                if (member === placemark) {
                  ids.push(item.id);
                  if (item.loadingLocation) {
                    coordKeys.add(`${item.loadingLocation.lat},${item.loadingLocation.lng}`);
                  }
                  break;
                }
              }
            }
            if (ids.length === 0) return;
            activeClusterFilterRef.current = ids;
            onClusterChangeRef.current?.(ids);
            const mapInstance = mapRef.current;
            if (mapInstance && coordKeys.size > 1) {
              const bounds = cluster.getBounds();
              if (bounds) {
                mapInstance.setBounds(bounds, { checkZoomRange: true });
              }
            }
          });
          return cluster;
        };
        map.geoObjects.add(clusterer);
        clustererRef.current = clusterer;

        map.events.add("boundschange", scheduleOutsiderCheck);

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
      clearOutsiderTimer();
      clustererRef.current = null;
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
