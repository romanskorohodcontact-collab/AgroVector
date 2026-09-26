"use client";

export type SearchMode = "load" | "transport";

interface SearchModeToggleProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
}

const TOGGLE_BASE =
  "inline-flex items-center justify-center h-9 px-4 rounded-pill text-sm font-medium tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 cursor-pointer";
const TOGGLE_ACTIVE = "bg-accent text-text-inverse";
const TOGGLE_INACTIVE =
  "bg-bg-surface text-text-secondary border-[0.8px] border-outline hover:text-text-primary hover:border-outline-hover";

export function SearchModeToggle({ mode, onChange }: SearchModeToggleProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Режим поиска">
      <button
        type="button"
        aria-pressed={mode === "load"}
        onClick={() => onChange("load")}
        className={`${TOGGLE_BASE} ${mode === "load" ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}`}
      >
        Груз
      </button>
      <button
        type="button"
        aria-pressed={mode === "transport"}
        onClick={() => onChange("transport")}
        className={`${TOGGLE_BASE} ${mode === "transport" ? TOGGLE_ACTIVE : TOGGLE_INACTIVE}`}
      >
        Транспорт
      </button>
    </div>
  );
}
