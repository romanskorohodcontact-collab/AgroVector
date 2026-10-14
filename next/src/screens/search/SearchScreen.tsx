"use client";

import { useRouter } from "next/navigation";
import type { SearchFiltersValues } from "@/entities/load/model";
import { SearchModeToggle, type SearchMode } from "@/shared/ui/SearchModeToggle";
import { LoadSearchView } from "./LoadSearchView";
import { TransportSearchView } from "./TransportSearchView";

interface SearchScreenProps {
  mode: SearchMode;
  initialValues?: SearchFiltersValues;
}

export function SearchScreen({ mode, initialValues }: SearchScreenProps) {
  const router = useRouter();

  function handleModeChange(next: SearchMode) {
    router.push(`/search?type=${next}`);
  }

  return (
    <>
      {mode === "load" ? <LoadSearchView initialValues={initialValues} /> : <TransportSearchView />}
    </>
  );
}
