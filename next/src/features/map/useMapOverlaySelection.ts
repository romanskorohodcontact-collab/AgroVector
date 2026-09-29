"use client";

import { useCallback, useState } from "react";

export interface MapOverlaySelection {
  selectedId: string | null;
  clusterFilter: string[] | null;
  selectItem: (id: string) => void;
  selectCluster: (ids: string[]) => void;
  clear: () => void;
}

export function useMapOverlaySelection(): MapOverlaySelection {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clusterFilter, setClusterFilter] = useState<string[] | null>(null);

  const clear = useCallback(() => {
    setSelectedId(null);
    setClusterFilter(null);
  }, []);

  const selectItem = useCallback((id: string) => {
    setSelectedId(id);
    setClusterFilter(null);
  }, []);

  const selectCluster = useCallback((ids: string[]) => {
    if (ids.length > 0) setSelectedId(null);
    setClusterFilter(ids.length > 0 ? ids : null);
  }, []);

  return { selectedId, clusterFilter, selectItem, selectCluster, clear };
}
