"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadCard } from "@/entities/load";
import type { LoadSearchResult, LoadSuggestions } from "@/entities/load/model";
import { Header } from "@/widgets/header";
import { LoadsMap } from "@/widgets/loads-map";
import { SearchFilters, type SearchFiltersValues } from "@/widgets/search-filters";

const PAGE_SIZE = 5;

const EMPTY_SUGGESTIONS: LoadSuggestions = {
  loadingPlaces: [],
  unloadingPlaces: [],
  cargo: [],
  companyNames: [],
};

interface SearchScreenProps {
  initialValues?: SearchFiltersValues;
}

export function SearchScreen({ initialValues = {} }: SearchScreenProps) {
  const [values, setValues] = useState<SearchFiltersValues>(initialValues);
  const [applied, setApplied] = useState<SearchFiltersValues>(initialValues);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] =
    useState<LoadSuggestions>(EMPTY_SUGGESTIONS);

  const query = useQuery<LoadSearchResult>({
    queryKey: ["loads-search", applied, page],
    queryFn: () => fetchSearch(applied, page),
  });

  useEffect(() => {
    setValues(initialValues);
    setApplied(initialValues);
    setPage(1);
  }, [initialValues]);

  const result = query.data;
  useEffect(() => {
    if (result) setSuggestions(result.suggestions);
  }, [result]);

  function handleSubmit() {
    setPage(1);
    setApplied(values);
  }

  const totalPages = result ? Math.max(1, Math.ceil(result.total / PAGE_SIZE)) : 1;

  return (
    <main>
      <Header />
      <SearchFilters
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        suggestions={suggestions}
      />
      <LoadsMap mapItems={result?.mapItems ?? []} />
      <div
        style={{
          margin: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {query.isPending && !result ? (
          <p>Загрузка…</p>
        ) : query.isError ? (
          <p>Не удалось загрузить заявки</p>
        ) : result && result.items.length === 0 ? (
          <p>Заявок не найдено</p>
        ) : (
          result?.items.map((load) => <LoadCard key={load.id} load={load} />)
        )}
      </div>
      {result ? (
        <div
          style={{
            margin: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            style={buttonStyle}
          >
            Назад
          </button>
          <span>
            Страница {page} из {totalPages} · Всего: {result.total}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
            style={buttonStyle}
          >
            Вперёд
          </button>
        </div>
      ) : null}
    </main>
  );
}

async function fetchSearch(
  filters: SearchFiltersValues,
  page: number
): Promise<LoadSearchResult> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  for (const key of [
    "from",
    "to",
    "cargo",
    "company",
    "tonnage",
    "rate",
    "distance",
  ] as const) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  const response = await fetch(`/api/loads?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявки");
  }
  return response.json();
}

const buttonStyle = {
  padding: "6px 12px",
  border: "1px solid #000",
  background: "none",
  cursor: "pointer",
};