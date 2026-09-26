"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Transport,
  TransportFilters,
  TransportSearchResult,
  TransportSort,
  TransportSortField,
  SortDirection,
} from "@/entities/transport/model";
import {
  BODY_TYPES,
  CARGO_TYPE_DESCRIPTIONS,
  CARGO_TYPES,
  DEFAULT_TRANSPORT_SORT,
  LOADING_TYPES,
  VAT_TYPES,
  WORK_DISTRICTS_REGIONS,
} from "@/entities/transport/model";
import { TransportDetailButton } from "@/widgets/transport-detail";
import { TransportsMap } from "@/widgets/transports-map";
import { DistrictRegionSelectorPopover } from "@/shared/ui/DistrictRegionSelectorPopover";
import { MultiSelectDropdown } from "@/shared/ui/MultiSelectDropdown";
import { DescriptiveMultiSelect } from "@/shared/ui/DescriptiveMultiSelect";
import { AnchoredModal } from "@/shared/ui/AnchoredModal";
import { FIELD_LABEL, FormInputIcon } from "@/shared/ui/FormInput";
import { Pagination } from "./ui/Pagination";
import { BadgeRussianRuble, ChevronDown } from "lucide-react";

const PAGE_SIZE = 10;

export function TransportSearchView() {
  const [values, setValues] = useState<TransportFilters>({});
  const [applied, setApplied] = useState<TransportFilters>({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TransportSort>(DEFAULT_TRANSPORT_SORT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clusterFilter, setClusterFilter] = useState<string[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const query = useQuery<TransportSearchResult>({
    queryKey: ["transports-search", applied, page, sort],
    queryFn: () => fetchTransports(applied, page, sort),
  });

  const selectedQuery = useQuery<Transport>({
    queryKey: ["transport", selectedId],
    queryFn: () => fetchTransport(selectedId as string),
    enabled: Boolean(selectedId),
  });

  const clusterQuery = useQuery<Transport[]>({
    queryKey: ["transports-by-ids", clusterFilter?.join(",") ?? ""],
    queryFn: () => fetchTransportsByIds(clusterFilter ?? []),
    enabled: Boolean(clusterFilter && clusterFilter.length > 0),
  });

  const result = query.data;
  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  const isDirty = useMemo(
    () => !areFiltersEqual(values, applied),
    [values, applied]
  );
  const searchEnabled = !hasSearched || isDirty;
  const resultsListClass = "flex flex-col gap-3"

  function handleSubmit() {
    setHasSearched(true);
    setPage(1);
    setApplied(values);
    setSelectedId(null);
    setClusterFilter(null);
  }

  function handleReset() {
    setValues({});
    setApplied({});
    setPage(1);
    setSelectedId(null);
    setClusterFilter(null);
  }

  function handleResetOneFilter() {
    // Обнуляет значения одного фильтра — активного (открытого).
    // После вызова обнуляется значение выбранного фильтра, поиск применяется кнопкой «Найти».
    if (!activeFilter) return;
    const key = activeFilter as keyof TransportFilters;
    setValues((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleArrayField(
    key: "bodyTypes" | "loadingTypes" | "vatTypes" | "cargoTypes" | "workRegions",
    item: string
  ) {
    setValues((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [key]: next };
    });
  }

  function toggleDistrict(district: string) {
    const districtRegions = WORK_DISTRICTS_REGIONS[district];
    if (!districtRegions) return;
    setValues((prev) => {
      const current = prev.workRegions ?? [];
      const allSelected = districtRegions.every((r) => current.includes(r));
      if (allSelected) {
        return {
          ...prev,
          workRegions: current.filter((r) => !districtRegions.includes(r)),
        };
      }
      const next = new Set(current);
      for (const r of districtRegions) next.add(r);
      return { ...prev, workRegions: Array.from(next) };
    });
  }

  function setMaxRate(value: string) {
    const num = Number(value);
    setValues((prev) => ({
      ...prev,
      maxRatePerKm: Number.isFinite(num) && num > 0 ? num : undefined,
    }));
  }

  return (
    <main className="grid min-w-0 min-h-0 flex-1 grid-cols-[1fr_1fr] overflow-hidden max-[960px]:h-auto max-[960px]:flex-none max-[960px]:grid-cols-1 max-[960px]:overflow-visible">
      <div className="grid grid-rows-[auto_1fr] min-h-0 border-r border-divider-strong max-[960px]:grid-rows-none max-[960px]:border-r-0">
        <section
          className="px-6 py-3 border-b border-divider-strong min-h-0"
          aria-label="Фильтр заявок"
        >
          <FilterForm
            values={values}
            toggleArrayField={toggleArrayField}
            toggleDistrict={toggleDistrict}
            setMaxRate={setMaxRate}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onResetOneFilter={handleResetOneFilter}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchEnabled={searchEnabled}
            filtersCollapsed={filtersCollapsed}
            onToggleFilters={() => setFiltersCollapsed((v) => !v)}
          />
        </section>


        <div className={`min-h-0 grid grid-cols-[1fr_2fr] max-[960px]:grid-cols-1`}>
          <SortPanel sort={sort} onSort={setSort} horizontal={filtersCollapsed} />

          <section
            className={`p-4 min-h-0 overflow-y-auto bg-bg-subtle max-[960px]:overflow-visible max-[960px]:h-auto ${filtersCollapsed ? "flex-1" : ""}`}
            aria-label="Заявки на транспорт"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                {clusterFilter && clusterQuery.data
                  ? `${clusterQuery.data.length} заявок в точке`
                  : "Заявки на транспорт"}
              </span>
              {selectedId ? (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="h-6 px-2 rounded-pill bg-accent-orange text-xs font-medium text-text-inverse tracking-[-0.12px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-accent-orange/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  Сбросить выбор.
                </button>
              ) : clusterFilter ? (
                <button
                  type="button"
                  onClick={() => setClusterFilter(null)}
                  className="h-6 px-2 rounded-pill bg-accent-orange text-xs font-medium text-text-inverse tracking-[-0.12px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-accent-orange/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  Сбросить фильтр..
                </button>
              ) : result ? (
                <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                  {`${result.items.length} из ${result.total}`}
                </span>
              ) : null}
            </div>

            {selectedId ? (
              selectedQuery.isPending ? (
                <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                  Загрузка…
                </p>
              ) : selectedQuery.isError ? (
                <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                  Не удалось загрузить заявку
                </p>
              ) : selectedQuery.data ? (
                <div className={resultsListClass}>
                  <TransportDetailButton transport={selectedQuery.data} />
                </div>
              ) : null
            ) : clusterFilter ? (
              clusterQuery.isPending ? (
                <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                  Загрузка…
                </p>
              ) : clusterQuery.isError ? (
                <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                  Не удалось загрузить заявки
                </p>
              ) : clusterQuery.data && clusterQuery.data.length === 0 ? (
                <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                  Заявок не найдено
                </p>
              ) : (
                <div className={resultsListClass}>
                  {clusterQuery.data?.map((transport) => (
                    <TransportDetailButton
                      key={transport.id}
                      transport={transport}
                    />
                  ))}
                </div>
              )
            ) : query.isPending && !result ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Загрузка…
              </p>
            ) : query.isError ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Не удалось загрузить заявки
              </p>
            ) : result && result.items.length === 0 ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Заявок не найдено
              </p>
            ) : (
              <div className={resultsListClass}>
                {result?.items.map((transport) => (
                  <TransportDetailButton key={transport.id} transport={transport} />
                ))}
              </div>
            )}

            {!selectedId && !clusterFilter && result ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={result.total}
                onPageChange={setPage}
              />
            ) : null}
          </section>
        </div>
      </div>

      {/*Карта*/}
      <div
        role="presentation"
        className="relative flex items-center justify-center gap-2.5 min-w-0 bg-bg-subtle bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] [background-size:36px_36px] max-[960px]:h-[320px]"
      >
        <span className="absolute top-5 left-5 z-10 px-3.5 py-2 rounded-pill bg-bg-surface shadow-[0_4px_16px_rgba(24,24,24,0.08)] text-[13px] font-medium text-text-primary tracking-[-0.13px]">
          Заявки на карте
        </span>
        <TransportsMap
          mapItems={result?.mapItems ?? []}
          className="h-full w-full"
          onSelect={(item) => setSelectedId(item.id)}
          onClusterChange={(ids) => setClusterFilter(ids.length > 0 ? ids : null)}
          activeClusterFilter={clusterFilter}
        />
      </div>
    </main >
  );
}

interface FilterFormProps {
  values: TransportFilters;
  toggleArrayField: (
    key: "bodyTypes" | "loadingTypes" | "vatTypes" | "cargoTypes" | "workRegions",
    item: string
  ) => void;
  toggleDistrict: (district: string) => void;
  setMaxRate: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onResetOneFilter: () => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  searchEnabled: boolean;
  filtersCollapsed: boolean;
  onToggleFilters: () => void;
}

function FilterForm({
  values,
  toggleArrayField,
  toggleDistrict,
  setMaxRate,
  onSubmit,
  onReset,
  onResetOneFilter,
  activeFilter,
  setActiveFilter,
  searchEnabled,
  filtersCollapsed,
  onToggleFilters,
}: FilterFormProps) {
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const moreFiltersRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function handleToggleFilters() {
    setActiveFilter(null);
    setMoreFiltersOpen(false);
    onToggleFilters();
  }

  function hasAppliedFilters(f: TransportFilters): boolean {
    return (
      f.maxRatePerKm !== undefined ||
      (f.bodyTypes?.length ?? 0) > 0 ||
      (f.loadingTypes?.length ?? 0) > 0 ||
      (f.vatTypes?.length ?? 0) > 0 ||
      (f.cargoTypes?.length ?? 0) > 0 ||
      (f.workRegions?.length ?? 0) > 0
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      {/*Блок сокращенного отображения*/}
      <div className="flex justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            className="flex items-center justify-end gap-2 text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:text-text-primary"
          >
            Вид заявок
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-4 h-4 shrink-0 transition-transform duration-150`}
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4">

          {filtersCollapsed && hasAppliedFilters(values) && <>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center justify-end gap-2 text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:text-text-primary"
            >
              Сбросить фильтры
            </button>
            <div className="h-full border-r border-border" /></>
          }


          <button
            type="button"
            onClick={handleToggleFilters}
            aria-expanded={!filtersCollapsed}
            className="flex items-center justify-end gap-2 text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:text-text-primary"
          >
            {filtersCollapsed ? "Открыть панель" : "Скрыть панель"}
          </button>
        </div>
      </div>
      {!filtersCollapsed && <div className="w-full h-1 border-b border-border" />}

      {/*Панель с фильтрами*/}
      <div className={`grid grid-cols-3 items-end gap-3 max-[960px]:grid-cols-2 max-[560px]:grid-cols-1 ${filtersCollapsed ? "hidden" : ""}`}>
        <DistrictRegionSelectorPopover
          label="Регионы работы"
          selectedRegions={values.workRegions ?? []}
          onToggleRegion={(region) => toggleArrayField("workRegions", region)}
          onToggleDistrict={toggleDistrict}
          onReset={onResetOneFilter}
          panelWidthClass="min-w-[400px] max-w-[90vw]"
          open={activeFilter === "workRegions"}
          onOpenChange={(v) => setActiveFilter(v ? "workRegions" : null)}
        />
        <MultiSelectDropdown
          label="Тип кузова"
          options={BODY_TYPES}
          selected={values.bodyTypes ?? []}
          onToggle={(item) => toggleArrayField("bodyTypes", item)}
          placeholder="Любой"
          panelWidthClass="min-w-[450px]"
          open={activeFilter === "bodyTypes"}
          onOpenChange={(v) => setActiveFilter(v ? "bodyTypes" : null)}
          onReset={onResetOneFilter}
        />
        <MultiSelectDropdown
          label="Тип загрузки"
          options={LOADING_TYPES}
          selected={values.loadingTypes ?? []}
          onToggle={(item) => toggleArrayField("loadingTypes", item)}
          placeholder="Любой"
          panelWidthClass="min-w-[360px]"
          open={activeFilter === "loadingTypes"}
          onOpenChange={(v) => setActiveFilter(v ? "loadingTypes" : null)}
          onReset={onResetOneFilter}
        />
        <NumberField
          label="Ставка до ₽/км"
          value={values.maxRatePerKm != null ? String(values.maxRatePerKm) : ""}
          onChange={setMaxRate}
          id="f-rate"
          placeholder="Не имеет значения"
        />
        <MultiSelectDropdown
          label="Форма оплаты"
          options={VAT_TYPES}
          selected={values.vatTypes ?? []}
          onToggle={(item) => toggleArrayField("vatTypes", item)}
          placeholder="Любой"
          panelWidthClass="min-w-[230px]"
          columns={1}
          open={activeFilter === "vatTypes"}
          onOpenChange={(v) => setActiveFilter(v ? "vatTypes" : null)}
          onReset={onResetOneFilter}
        />
        <DescriptiveMultiSelect
          label="Категория груза"
          options={CARGO_TYPES}
          descriptions={CARGO_TYPE_DESCRIPTIONS}
          selected={values.cargoTypes ?? []}
          onToggle={(item) => toggleArrayField("cargoTypes", item)}
          placeholder="Любой"
          panelWidthClass="min-w-[360px]"
          open={activeFilter === "cargoTypes"}
          onOpenChange={(v) => setActiveFilter(v ? "cargoTypes" : null)}
          onReset={onResetOneFilter}
        />
        {/*открывает модальное окно, где будут дополнительные фильтры*/}

        <>
          <button
            type="button"
            ref={moreFiltersRef}
            onClick={() => setMoreFiltersOpen((v) => !v)}
            aria-expanded={moreFiltersOpen}
            aria-haspopup="dialog"
            className="flex gap-2 h-[38px] px-4 items-center justify-center rounded-pill bg-bg-input text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-border"
          >
            <span> Больше фильтров </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${moreFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnchoredModal
            open={moreFiltersOpen}
            onClose={() => setMoreFiltersOpen(false)}
            triggerRef={moreFiltersRef}
            title="Дополнительные фильтры"
          >Content</AnchoredModal>
        </>
        <button
          type="button"
          onClick={onReset}
          className="h-9 px-4 gap-2 inline-flex items-center justify-center rounded-pill border-[0.8px] border-outline bg-bg-surface text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:text-text-primary hover:border-outline-hover"
        >
          Сбросить фильтры
        </button>
        <button
          type="submit"
          disabled={!searchEnabled}
          className={`h-9 px-4 gap-1.5 inline-flex items-center justify-center rounded-pill text-sm font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 ${searchEnabled
            ? "bg-accent cursor-pointer hover:bg-accent/90"
            : "bg-accent/50 cursor-not-allowed"
            }`}
        >
          Найти
        </button>
      </div>
    </form >
  );
}

interface NumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  placeholder: string;
  label: string;
}

function NumberField({ label, value, onChange, id, placeholder }: NumberFieldProps) {
  return (
    <div className="min-w-0">
      <span className={FIELD_LABEL}>{label}</span>
      <FormInputIcon
        id={id}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        min="0"
        autoComplete="off"
        icon={null}
      />
    </div>
  );
}

function RateIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-primary"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h8M9 2l-2 3M11.5 6.5h-7"></path>
      <path d="M10 14l-2-3"></path>
      <path d="M2 9h12"></path>
    </svg>
  );
}

interface SortPanelProps {
  sort: TransportSort;
  onSort: (next: TransportSort) => void;
  horizontal?: boolean;
}

const SORT_OPTIONS: {
  field: TransportSortField;
  label: string;
  hint?: string;
}[] = [
    { field: "minRatePerKm", label: "По ставке" },
    { field: "loadCapacityTons", label: "По тоннажу" },
    { field: "bodyVolumeM3", label: "По объёму кузова" },
  ];

const DEFAULT_DIRS: Record<TransportSortField, SortDirection> = {
  minRatePerKm: "desc",
  loadCapacityTons: "desc",
  bodyVolumeM3: "desc",
  createdAt: "desc",
};

function SortPanel({ sort, onSort, horizontal = false }: SortPanelProps) {
  const [dirs, setDirs] = useState<Record<TransportSortField, SortDirection>>(
    DEFAULT_DIRS
  );

  function choose(field: TransportSortField, dir: SortDirection) {
    setDirs((current) => ({ ...current, [field]: dir }));
    onSort({ field, dir });
  }

  return (
    <aside
      className="px-4 py-5 min-h-0 overflow-y-auto border-r border-divider-strong max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:overflow-visible"
      aria-label="Сортировка"
    >


      <h2 className="mb-4 text-sm font-semibold text-text-primary tracking-[-0.14px]">
        Фильтры
      </h2>

      <h2 className="mb-4 text-sm font-semibold text-text-primary tracking-[-0.14px]">
        Сортировка
      </h2>
      <div className="mb-4 flex flex-col gap-1">
        {SORT_OPTIONS.map((option) => {
          const active = sort.field === option.field;
          const activeDir = dirs[option.field];
          return (
            <div
              key={option.field}
              onClick={() => choose(option.field, activeDir)}
              className={`flex items-center justify-between gap-2 w-full px-3 py-[9px] rounded-xl cursor-pointer transition-colors duration-150 ${active ? "bg-bg-subtle" : "hover:bg-bg-subtle"
                }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                {!horizontal && (<span
                  className={`w-5 h-5 shrink-0 rounded-full border border-outline inline-flex items-center justify-center ${active ? "border-accent bg-accent" : ""}`}
                >
                  {active ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-bg-surface" />
                  ) : null}
                </span>)}

                {option.hint ? (
                  <span className="min-w-0">
                    <span className="block text-sm leading-[1.43] tracking-[-0.14px] text-text-primary">
                      {option.label}
                    </span>
                    <span className="block mt-0.5 text-xs leading-[1.4] text-text-muted tracking-[-0.14px]">
                      {option.hint}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-primary">
                    {option.label}
                  </span>
                )}
              </span>
              <div
                className="flex items-center gap-1 shrink-0"
                onClick={(event) => event.stopPropagation()}
              >
                <DirToggleButton
                  label={`${option.label}: по возрастанию`}
                  active={active && activeDir === "asc"}
                  onClick={() => choose(option.field, "asc")}
                >
                  <AscIcon />
                </DirToggleButton>
                <DirToggleButton
                  label={`${option.label}: по убыванию`}
                  active={active && activeDir === "desc"}
                  onClick={() => choose(option.field, "desc")}
                >
                  <DescIcon />
                </DirToggleButton>
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
}

interface DirToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function DirToggleButton({
  label,
  active,
  onClick,
  children,
}: DirToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors duration-150 ${active
        ? "bg-accent text-text-inverse"
        : "bg-bg-surface text-text-muted hover:text-text-primary"
        }`}
    >
      {children}
    </button>
  );
}

function AscIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 8.5 3.5-3.5 3.5 3.5"></path>
    </svg>
  );
}

function DescIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 5.5 3.5 3.5 3.5-3.5"></path>
    </svg>
  );
}

function arraysEqual(a: string[] | undefined, b: string[] | undefined) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((item) => set.has(item));
}

function areFiltersEqual(a: TransportFilters, b: TransportFilters): boolean {
  return (
    a.maxRatePerKm === b.maxRatePerKm &&
    arraysEqual(a.bodyTypes, b.bodyTypes) &&
    arraysEqual(a.loadingTypes, b.loadingTypes) &&
    arraysEqual(a.vatTypes, b.vatTypes) &&
    arraysEqual(a.cargoTypes, b.cargoTypes) &&
    arraysEqual(a.workRegions, b.workRegions)
  );
}

async function fetchTransports(
  filters: TransportFilters,
  page: number,
  sort: TransportSort
): Promise<TransportSearchResult> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  params.set("sort", `${sort.field}:${sort.dir}`);
  if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    params.set("bodyTypes", filters.bodyTypes.join(","));
  }
  if (filters.loadingTypes && filters.loadingTypes.length > 0) {
    params.set("loadingTypes", filters.loadingTypes.join(","));
  }
  if (filters.vatTypes && filters.vatTypes.length > 0) {
    params.set("vatTypes", filters.vatTypes.join(","));
  }
  if (filters.cargoTypes && filters.cargoTypes.length > 0) {
    params.set("cargoTypes", filters.cargoTypes.join(","));
  }
  if (filters.workRegions && filters.workRegions.length > 0) {
    params.set("workRegions", filters.workRegions.join(","));
  }
  if (filters.maxRatePerKm != null) {
    params.set("maxRatePerKm", String(filters.maxRatePerKm));
  }
  const response = await fetch(`/api/transports?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявки");
  }
  return response.json();
}

async function fetchTransport(id: string): Promise<Transport> {
  const response = await fetch(`/api/transports/${id}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявку");
  }
  return response.json();
}

async function fetchTransportsByIds(ids: string[]): Promise<Transport[]> {
  if (ids.length === 0) return [];
  const response = await fetch(`/api/transports?ids=${ids.join(",")}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявки");
  }
  return response.json();
}
