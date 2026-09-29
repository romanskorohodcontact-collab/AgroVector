"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadCard } from "@/entities/load";
import {
  DEFAULT_LOAD_SORT,
  type Load,
  type LoadSearchResult,
  type LoadSort,
  type LoadSortField,
  type LoadSuggestions,
  type SearchFiltersValues,
  type SortDirection,
} from "@/entities/load/model";
import { LoadsMap } from "@/widgets/loads-map";
import { useMapOverlaySelection } from "@/features/map/useMapOverlaySelection";
import { AutocompleteField } from "@/shared/ui/AutocompleteField";
import { FIELD_LABEL, FormInputIcon, FormSelect } from "@/shared/ui/FormInput";
import { Pagination } from "./ui/Pagination";
import { ChevronDown } from "lucide-react";

const PAGE_SIZE = 5;

const EMPTY_SUGGESTIONS: LoadSuggestions = {
  loadingPlaces: [],
  unloadingPlaces: [],
  cargo: [],
  companyNames: [],
};

interface LoadSearchViewProps {
  initialValues?: SearchFiltersValues;
}

export function LoadSearchView({ initialValues = {} }: LoadSearchViewProps) {
  const [values, setValues] = useState<SearchFiltersValues>(initialValues);
  const [applied, setApplied] = useState<SearchFiltersValues>(initialValues);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] =
    useState<LoadSuggestions>(EMPTY_SUGGESTIONS);
  const [sort, setSort] = useState<LoadSort>(DEFAULT_LOAD_SORT);
  const {
    selectedId,
    clusterFilter,
    selectItem,
    selectCluster,
    clear: clearMapSelection,
  } = useMapOverlaySelection();
  const [hasSearched, setHasSearched] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const query = useQuery<LoadSearchResult>({
    queryKey: ["loads-search", applied, page, sort],
    queryFn: () => fetchSearch(applied, page, sort),
  });

  const selectedQuery = useQuery<Load>({
    queryKey: ["load", selectedId],
    queryFn: () => fetchLoad(selectedId as string),
    enabled: Boolean(selectedId),
  });

  const clusterQuery = useQuery<Load[]>({
    queryKey: ["loads-by-ids", clusterFilter?.join(",") ?? ""],
    queryFn: () => fetchLoadsByIds(clusterFilter ?? []),
    enabled: Boolean(clusterFilter && clusterFilter.length > 0),
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

  const isDirty = useMemo(
    () => !areFiltersEqual(values, applied),
    [values, applied]
  );
  const searchEnabled = !hasSearched || isDirty;

  function handleSubmit() {
    setHasSearched(true);
    setPage(1);
    setApplied(values);
    clearMapSelection();
  }

  function handleReset() {
    setValues({});
    setApplied({});
    setPage(1);
    clearMapSelection();
  }

  function handleCompanyChange(value: string) {
    setValues((current) => ({ ...current, company: value }));
    setApplied((current) => ({ ...current, company: value }));
    setPage(1);
    clearMapSelection();
  }

  function setField(key: keyof SearchFiltersValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  return (
    <main className="grid min-w-0 min-h-0 flex-1 grid-cols-[1fr_1fr] overflow-hidden max-[960px]:h-auto max-[960px]:flex-none max-[960px]:grid-cols-1 max-[960px]:overflow-visible">
      <div className="grid grid-rows-[auto_1fr] min-h-0 border-r border-divider-strong max-[960px]:grid-rows-none max-[960px]:border-r-0">
        <section
          className="px-6 py-3 border-b border-divider-strong min-h-0"
          aria-label="Фильтр заявок"
        >
          <FilterForm
            values={values}
            setField={setField}
            onSubmit={handleSubmit}
            suggestions={suggestions}
            handleReset={handleReset}
            searchEnabled={searchEnabled}
            filtersCollapsed={filtersCollapsed}
            onToggleFilters={() => setFiltersCollapsed((v) => !v)}
          />
        </section>

        <div className={`min-h-0 grid grid-cols-[1fr_2fr] max-[960px]:grid-cols-1`}>
          <SortPanel
            sort={sort}
            onSort={setSort}
            horizontal={filtersCollapsed}
            company={values.company ?? ""}
            companyOptions={suggestions.companyNames}
            onCompanyChange={handleCompanyChange}
          />

          <section className={`p-4 min-h-0 overflow-y-auto bg-bg-subtle max-[960px]:overflow-visible max-[960px]:h-auto`} aria-label="Заявки на груз">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                {clusterFilter && clusterQuery.data
                  ? `${clusterQuery.data.length} заявок в точке`
                  : "Заявки на груз"}
              </span>
              {selectedId ? (
                <button
                  type="button"
                  onClick={clearMapSelection}
                  className="inline-flex items-center justify-center h-9 px-4 gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-outline-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сбросить выбор
                </button>
              ) : clusterFilter ? (
                <button
                  type="button"
                  onClick={clearMapSelection}
                  className="inline-flex items-center justify-center h-9 px-4 gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-outline-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сбросить фильтр
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
                <div className="flex flex-col gap-3">
                  <LoadCard load={selectedQuery.data} />
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
                <div className="flex flex-col gap-3">
                  {clusterQuery.data?.map((load) => (
                    <LoadCard key={load.id} load={load} />
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
              <div className="flex flex-col gap-3">
                {result?.items.map((load) => (
                  <LoadCard key={load.id} load={load} />
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

      <div
        role="presentation"
        className="relative flex items-center justify-center gap-2.5 min-w-0 bg-bg-subtle bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] [background-size:36px_36px] max-[960px]:h-[320px]"
      >
        <span className="absolute top-5 left-5 z-10 px-3.5 py-2 rounded-pill bg-bg-surface shadow-[0_4px_16px_rgba(24,24,24,0.08)] text-[13px] font-medium text-text-primary tracking-[-0.13px]">
          Заявки на карте
        </span>
        <LoadsMap
          mapItems={result?.mapItems ?? []}
          className="h-full w-full"
          onSelect={(item) => selectItem(item.id)}
          showHoverCard
          onClusterChange={selectCluster}
          activeClusterFilter={clusterFilter}
        />
      </div>
    </main>
  );
}

interface FilterFormProps {
  values: SearchFiltersValues;
  setField: (key: keyof SearchFiltersValues, value: string) => void;
  onSubmit: () => void;
  suggestions: LoadSuggestions;
  handleReset: () => void;
  searchEnabled: boolean;
  filtersCollapsed: boolean;
  onToggleFilters: () => void;
}

function FilterForm({
  values,
  setField,
  onSubmit,
  suggestions,
  handleReset,
  searchEnabled,
  filtersCollapsed,
  onToggleFilters,
}: FilterFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function handleToggleFilters() {
    onToggleFilters();
  }

  function hasAppliedFilters(f: SearchFiltersValues): boolean {
    return (
      (f.from?.length ?? 0) > 0 ||
      (f.to?.length ?? 0) > 0 ||
      (f.cargo?.length ?? 0) > 0 ||
      (f.tonnage?.length ?? 0) > 0 ||
      (f.distance?.length ?? 0) > 0 ||
      (f.company?.length ?? 0) > 0 ||
      (f.rate?.length ?? 0) > 0
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >

      {/*Форма с фитрами*/}
      <div className={`grid grid-cols-3 items-end gap-3 max-[960px]:grid-cols-2 max-[560px]:grid-cols-1 ${filtersCollapsed ? "hidden" : ""}`}>
        <AutocompleteField
          label="Город отправки"
          value={values.from ?? ""}
          onChange={(value) => setField("from", value)}
          options={suggestions.loadingPlaces}
          id="f-from"
          placeholder="Краснодар"
        />
        <AutocompleteField
          label="Город назначения"
          value={values.to ?? ""}
          onChange={(value) => setField("to", value)}
          options={suggestions.unloadingPlaces}
          id="f-to"
          placeholder="Ростов-на-Дону"
        />
        <AutocompleteField
          label="Груз"
          value={values.cargo ?? ""}
          onChange={(value) => setField("cargo", value)}
          options={suggestions.cargo}
          id="f-cargo"
          placeholder="Пшеница, кукуруза…"
        />
        <NumberField
          label="Вес груза"
          value={values.tonnage ?? ""}
          onChange={(value) => setField("tonnage", value)}
          id="f-tons"
          placeholder="В тоннах или кг"
        />
        <NumberField
          label="Расстояние"
          value={values.distance ?? ""}
          onChange={(value) => setField("distance", value)}
          id="f-km"
          placeholder="до 600 км"
        />
        <NumberField
          label="Цена ₽/км"
          value={values.rate ?? ""}
          onChange={(value) => setField("rate", value)}
          id="f-rate"
          placeholder="от 150₽/км"
        />
      </div>
      {/*Блок сокращенного отображения*/}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleToggleFilters}
          aria-expanded={!filtersCollapsed}
          className="flex gap-2 h-[38px] px-4 items-center justify-center rounded-pill bg-bg-input text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-border"
        >
          <span>{filtersCollapsed ? "Открыть панель" : "Скрыть панель"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 ${filtersCollapsed ? "" : "rotate-180"}`}
          />
        </button>

        <button
          type="button"
          onClick={handleReset}
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

    </form>
  );
}

interface FieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  hideLabel?: boolean;
}

interface NumberFieldProps extends FieldProps {
  id: string;
  placeholder: string;
}

function NumberField({
  label,
  hideLabel = false,
  value,
  onChange,
  id,
  placeholder,
}: NumberFieldProps) {
  return (
    <div className="min-w-0">
      {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}
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

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function CompanySelect({ value, onChange, options }: CompanySelectProps) {
  return (
    <div className="min-w-0">
      <FormSelect
        id="f-company"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Все компании</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}

interface SortPanelProps {
  sort: LoadSort;
  onSort: (next: LoadSort) => void;
  horizontal?: boolean;
  company: string;
  companyOptions: string[];
  onCompanyChange: (value: string) => void;
}

const SORT_OPTIONS: {
  field: LoadSortField;
  label: string;
  hint?: string;
}[] = [
    { field: "rate", label: "По ставке" },
    { field: "km", label: "По расстоянию" },
    { field: "tons", label: "По тоннажу" },
    {
      field: "ratePerKm",
      label: "Самые выгодные",
      hint: "Ставка / расстояние",
    },
  ];

const DEFAULT_DIRS: Record<LoadSortField, SortDirection> = {
  rate: "desc",
  km: "asc",
  tons: "desc",
  ratePerKm: "desc",
};

function SortPanel({
  sort,
  onSort,
  horizontal = false,
  company,
  companyOptions,
  onCompanyChange,
}: SortPanelProps) {
  const [dirs, setDirs] = useState<Record<LoadSortField, SortDirection>>(
    DEFAULT_DIRS
  );

  function choose(field: LoadSortField, dir: SortDirection) {
    setDirs((current) => ({ ...current, [field]: dir }));
    onSort({ field, dir });
  }

  return (
    <aside
      className="px-4 py-5 min-h-0 overflow-y-auto border-r border-divider-strong max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:overflow-visible"
      aria-label="Сортировка"
    >
      <h2 className={`mb-4 text-sm font-semibold text-text-primary tracking-[-0.14px]`}>
        Сортировка
      </h2>
      <div className="flex flex-col gap-1">
        {SORT_OPTIONS.map((option) => {
          const active = sort.field === option.field;
          const activeDir = dirs[option.field];
          return (
            <div
              key={option.field}
              onClick={() =>
                choose(
                  option.field,
                  option.field === "ratePerKm" ? "desc" : activeDir
                )
              }
              className={`flex items-center justify-between gap-2 ${horizontal ? "min-w-auto" : "w-full"} px-3 py-[9px] rounded-xl cursor-pointer transition-colors duration-150 ${active ? "bg-bg-subtle" : "hover:bg-bg-subtle"
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
                  <span className={`${horizontal ? "flex gap-2" : ""} min-w-0`}>
                    <span className="block text-sm leading-[1.43] tracking-[-0.14px] text-text-primary">
                      {option.label}
                    </span>
                    {!horizontal && <span className="block mt-0.5 text-xs leading-[1.4] text-text-muted tracking-[-0.14px]">
                      {option.hint}
                    </span>}
                    {horizontal && <span className="block mt-0.5 text-xs leading-[1.4] text-text-muted tracking-[-0.14px]">
                      ₽/км
                    </span>}
                  </span>
                ) : (
                  <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-primary">
                    {option.label}
                  </span>
                )}
              </span>
              {option.field !== "ratePerKm" ? (
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
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary tracking-[-0.14px]">
          Доп. фильтры
        </h2>
        <CompanySelect
          value={company}
          onChange={onCompanyChange}
          options={companyOptions}
        />
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

function areFiltersEqual(
  a: SearchFiltersValues,
  b: SearchFiltersValues
): boolean {
  return (
    a.from === b.from &&
    a.to === b.to &&
    a.cargo === b.cargo &&
    a.tonnage === b.tonnage &&
    a.rate === b.rate &&
    a.distance === b.distance &&
    a.company === b.company
  );
}

async function fetchSearch(
  filters: SearchFiltersValues,
  page: number,
  sort: LoadSort
): Promise<LoadSearchResult> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  params.set("sort", `${sort.field}:${sort.dir}`);
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

async function fetchLoad(id: string): Promise<Load> {
  const response = await fetch(`/api/loads/${id}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявку");
  }
  return response.json();
}

async function fetchLoadsByIds(ids: string[]): Promise<Load[]> {
  if (ids.length === 0) return [];
  const response = await fetch(`/api/loads?ids=${ids.join(",")}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявки");
  }
  return response.json();
}
