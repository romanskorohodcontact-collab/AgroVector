"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { LoadSearchResult } from "@/entities/load/model";
import { CARGO_TYPES, TRANSPORT_TYPES } from "@/entities/transport/model";
import { AutocompleteField } from "@/shared/ui/AutocompleteField";
import { DistrictRegionSelectorPopover } from "@/shared/ui/DistrictRegionSelectorPopover";
import { MultiSelectDropdown } from "@/shared/ui/MultiSelectDropdown";
import { SearchModeToggle, type SearchMode } from "@/shared/ui/SearchModeToggle";
import { WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

async function fetchSuggestions(): Promise<LoadSearchResult> {
  const response = await fetch("/api/loads?page=1&limit=5");
  if (!response.ok) {
    throw new Error("Не удалось получить подсказки");
  }
  return response.json();
}

const SUBMIT_BUTTON =
  "inline-flex items-center justify-center h-[38px] px-[21px] gap-1.5 rounded-pill bg-accent text-base font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-accent/90 max-md:w-full";

export function SearchPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("load");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cargo, setCargo] = useState("");

  const [transportTypes, setTransportTypes] = useState<string[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>([]);
  const [workRegions, setWorkRegions] = useState<string[]>([]);

  const suggestionsQuery = useQuery<LoadSearchResult>({
    queryKey: ["load-suggestions"],
    queryFn: fetchSuggestions,
    enabled: mode === "load",
  });
  const suggestions = suggestionsQuery.data?.suggestions;

  function toggleTransportType(item: string) {
    setTransportTypes((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function toggleCargoType(item: string) {
    setCargoTypes((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function toggleRegion(region: string) {
    setWorkRegions((prev) =>
      prev.includes(region)
        ? prev.filter((x) => x !== region)
        : [...prev, region]
    );
  }

  function toggleDistrict(district: string) {
    const districtRegions = WORK_DISTRICTS_REGIONS[district];
    if (!districtRegions) return;
    setWorkRegions((prev) => {
      const allSelected = districtRegions.every((r) => prev.includes(r));
      if (allSelected) {
        return prev.filter((r) => !districtRegions.includes(r));
      }
      const next = new Set(prev);
      for (const r of districtRegions) next.add(r);
      return Array.from(next);
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (mode === "load") {
      params.set("type", "load");
      if (from.trim()) params.set("from", from.trim());
      if (to.trim()) params.set("to", to.trim());
      if (cargo.trim()) params.set("cargo", cargo.trim());
    } else {
      params.set("type", "transport");
      if (transportTypes.length > 0) params.set("transportTypes", transportTypes.join(","));
      if (cargoTypes.length > 0) params.set("cargoTypes", cargoTypes.join(","));
      if (workRegions.length > 0) params.set("regions", workRegions.join(","));
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <section
      className="relative z-10 -mt-16 max-md:-mt-14"
      aria-label="Поиск заявок"
    >
      <div className="container-app">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 rounded-[24px] bg-bg-subtle"
        >
          <SearchModeToggle mode={mode} onChange={setMode} />

          {mode === "load" ? (
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-end max-lg:grid-cols-2 max-md:grid-cols-1">
              <SearchField
                id="home-from"
                label="Погрузка"
                placeholder="Город, область"
                value={from}
                onChange={setFrom}
                options={suggestions?.loadingPlaces ?? []}
              />

              <SearchField
                id="home-to"
                label="Выгрузка"
                placeholder="Город, область"
                value={to}
                onChange={setTo}
                options={suggestions?.unloadingPlaces ?? []}
              />
              <SearchField
                id="home-cargo"
                label="Название груза"
                placeholder="Пшеница, кукуруза…"
                value={cargo}
                onChange={setCargo}
                options={suggestions?.cargo ?? []}
              />
              <button type="submit" className={SUBMIT_BUTTON}>
                Найти
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-end max-lg:grid-cols-2 max-md:grid-cols-1">
              <MultiSelectDropdown
                label="Тип транспорта"
                options={TRANSPORT_TYPES}
                selected={transportTypes}
                onToggle={toggleTransportType}
                placeholder="Любой"
              />
              <MultiSelectDropdown
                label="Тип груза"
                options={CARGO_TYPES}
                selected={cargoTypes}
                onToggle={toggleCargoType}
                placeholder="Любой"
              />
              <DistrictRegionSelectorPopover
                label="Регионы работы"
                selectedRegions={workRegions}
                onToggleRegion={toggleRegion}
                onToggleDistrict={toggleDistrict}
              />
              <button type="submit" className={SUBMIT_BUTTON}>
                Найти
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

interface SearchFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
}: SearchFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block mb-1.5 text-xs font-medium text-text-muted tracking-[-0.12px]"
      >
        {label}
      </label>
      <AutocompleteField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        hideLabel
      />
    </div>
  );
}
