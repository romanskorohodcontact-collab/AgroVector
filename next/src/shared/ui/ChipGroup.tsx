"use client";

interface ChipGroupProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
  required?: boolean;
}

export function ChipGroup({
  label,
  options,
  selected,
  onToggle,
  required,
}: ChipGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`inline-flex items-center px-[10px] py-[5px] rounded-pill text-[12px] whitespace-nowrap transition-colors duration-150 ${
                active
                  ? "bg-accent text-white"
                  : "bg-bg-subtle text-text-secondary hover:bg-[#EFEFEF]"
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