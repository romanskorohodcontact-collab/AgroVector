"use client";

interface ChipGroupProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
  required?: boolean;
  hideLabel?: boolean;
}

export function ChipGroup({
  label,
  options,
  selected,
  onToggle,
  required,
  hideLabel,
}: ChipGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {hideLabel ? null : (
        <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.13px] text-text-muted">
          {label}
          {required ? " *" : ""}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`inline-flex items-center rounded-pill px-[10px] py-[5px] text-[12px] whitespace-nowrap transition-colors duration-150 ${
                active
                  ? "bg-accent text-text-inverse"
                  : "bg-bg-subtle text-text-secondary hover:bg-bg-hover"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
