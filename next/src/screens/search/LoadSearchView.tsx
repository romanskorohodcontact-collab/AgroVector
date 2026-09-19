"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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
import { AutocompleteField } from "@/shared/ui/AutocompleteField";
import { FormInputIcon, FormSelect } from "@/shared/ui/FormInput";
import { Pagination } from "./ui/Pagination";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useQuery<LoadSearchResult>({
    queryKey: ["loads-search", applied, page, sort],
    queryFn: () => fetchSearch(applied, page, sort),
  });

  const selectedQuery = useQuery<Load>({
    queryKey: ["load", selectedId],
    queryFn: () => fetchLoad(selectedId as string),
    enabled: Boolean(selectedId),
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
    setSelectedId(null);
  }

  function handleReset() {
    setValues({});
    setApplied({});
    setPage(1);
    setSelectedId(null);
  }

  function setField(key: keyof SearchFiltersValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  return (
    <main className="grid min-w-0 min-h-0 flex-1 grid-cols-[1fr_1fr] overflow-hidden max-[960px]:h-auto max-[960px]:flex-none max-[960px]:grid-cols-1 max-[960px]:overflow-visible">
      <div className="grid grid-rows-[auto_1fr] min-h-0 border-r border-[#0D0D0D12] max-[960px]:grid-rows-none max-[960px]:border-r-0">
        <section
          className="flex flex-col gap-3 px-6 pt-4 pb-5 border-b border-[#0D0D0D12] min-h-0"
          aria-label="Фильтр заявок"
        >


          <FilterForm
            values={values}
            setField={setField}
            onSubmit={handleSubmit}
            suggestions={suggestions}
            handleReset={handleReset}
          />


        </section>

        <div className="grid grid-cols-[1fr_2fr] min-h-0 max-[960px]:grid-cols-1">
          <SortPanel sort={sort} onSort={setSort} />

          <section className="p-4 min-h-0 overflow-y-auto bg-bg-subtle max-[960px]:overflow-visible max-[960px]:h-auto" aria-label="Заявки на груз">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                Заявки на груз
              </span>
              {selectedId ? (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center justify-center h-9 px-4 gap-2 rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-white text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-[#0D0D0D33] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сбросить выбор
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

            {!selectedId && result ? (
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
        className="relative flex items-center justify-center gap-2.5 min-w-0 bg-bg-subtle bg-[linear-gradient(rgba(13,13,13,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,13,0.05)_1px,transparent_1px)] [background-size:36px_36px] max-[960px]:h-[320px]"
      >
        <span className="absolute top-5 left-5 z-10 px-3.5 py-2 rounded-pill bg-white shadow-[0_4px_16px_rgba(24,24,24,0.08)] text-[13px] font-medium text-text-primary tracking-[-0.13px]">
          Заявки на карте
        </span>
        <LoadsMap
          mapItems={result?.mapItems ?? []}
          className="h-full w-full"
          onSelect={(item) => setSelectedId(item.id)}
          showHoverCard
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
}

function FilterForm({
  values,
  setField,
  onSubmit,
  suggestions,
  handleReset,
}: FilterFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-3 gap-3 items-end max-[960px]:grid-cols-2 max-[560px]:grid-cols-1"
    >
      <AutocompleteField
        value={values.from ?? ""}
        onChange={(value) => setField("from", value)}
        options={suggestions.loadingPlaces}
        id="f-from"
        placeholder="Город отправки"
      />
      <AutocompleteField
        value={values.to ?? ""}
        onChange={(value) => setField("to", value)}
        options={suggestions.unloadingPlaces}
        id="f-to"
        placeholder="Город назначения"
      />
      <AutocompleteField
        value={values.cargo ?? ""}
        onChange={(value) => setField("cargo", value)}
        options={suggestions.cargo}
        id="f-cargo"
        placeholder="Пшеница, кукуруза…"
      />
      <NumberField
        value={values.tonnage ?? ""}
        onChange={(value) => setField("tonnage", value)}
        id="f-tons"
        placeholder="Тоннаж от, т"
        icon="tons"
      />
      <NumberField
        value={values.distance ?? ""}
        onChange={(value) => setField("distance", value)}
        id="f-km"
        placeholder="до 600 км"
        icon="km"
      />
      <NumberField
        value={values.rate ?? ""}
        onChange={(value) => setField("rate", value)}
        id="f-rate"
        placeholder="от 10 000 ₽"
        icon="rate"
      />
      <CompanySelect
        value={values.company ?? ""}
        onChange={(value) => setField("company", value)}
        options={suggestions.companyNames}
      />
      <button
        type="submit"
        className="h-[44px] px-5 gap-1.5 inline-flex items-center justify-center rounded-pill bg-accent text-sm font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-accent/90 max-[960px]:h-10"
      >
        Найти
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="h-[44px] px-4 gap-1.5 inline-flex items-center justify-center rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-white text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:text-text-primary hover:border-[#0D0D0D33] max-[960px]:h-10"
      >
        Сбросить фильтры
      </button>
    </form>
  );
}

interface FieldProps {
  value: string;
  onChange: (value: string) => void;
}

interface NumberFieldProps extends FieldProps {
  id: string;
  placeholder: string;
  icon: "tons" | "km" | "rate";
}

function NumberField({
  value,
  onChange,
  id,
  placeholder,
  icon,
}: NumberFieldProps) {
  return (
    <div className="min-w-0">
      <FormInputIcon
        id={id}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        min="0"
        autoComplete="off"
        icon={<FieldIcon icon={icon} />}
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

function SortPanel({ sort, onSort }: SortPanelProps) {
  const [dirs, setDirs] = useState<Record<LoadSortField, SortDirection>>(
    DEFAULT_DIRS
  );

  function choose(field: LoadSortField, dir: SortDirection) {
    setDirs((current) => ({ ...current, [field]: dir }));
    onSort({ field, dir });
  }

  return (
    <aside
      className="px-4 py-5 min-h-0 overflow-y-auto border-r border-[#0D0D0D12] max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:overflow-visible"
      aria-label="Сортировка"
    >
      <h2 className="mb-4 text-sm font-semibold text-text-primary tracking-[-0.14px]">
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
              className={`flex items-center justify-between gap-2 w-full px-3 py-[9px] rounded-xl cursor-pointer transition-colors duration-150 ${
                active ? "bg-bg-subtle" : "hover:bg-bg-subtle"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-5 h-5 shrink-0 rounded-full border border-[#0D0D0D1A] inline-flex items-center justify-center ${
                    active ? "border-accent bg-accent" : ""
                  }`}
                >
                  {active ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
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
      className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-colors duration-150 ${
        active
          ? "bg-accent text-white"
          : "bg-white text-text-muted hover:text-text-primary"
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

type FieldIconType = "tons" | "km" | "rate";

function FieldIcon({ icon }: { icon: FieldIconType }) {
  switch (icon) {
    case "tons":
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
          <path d="M2 8h12"></path>
          <path d="M8 2v12"></path>
        </svg>
      );
    case "km":
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
          <circle cx="8" cy="8" r="6"></circle>
          <path d="M8 8 11 5"></path>
        </svg>
      );
    case "rate":
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
