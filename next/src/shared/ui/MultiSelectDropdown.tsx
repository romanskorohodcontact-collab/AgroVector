"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FilterPopover } from "./FilterPopover";

const inputClass =
  "h-[38px] w-full px-4 border-[1.2px] border-[#0D0D0D0D] rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer flex items-center";

const labelClass =
  "mb-1.5 block text-[12px] font-medium text-text-muted tracking-[-0.12px]";

interface MultiSelectDropdownProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  panelWidthClass?: string;
  columns?: 1 | 2;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  placeholder = "Выберите",
  hideLabel = false,
  panelWidthClass,
  columns = 2,
  open: controlledOpen,
  onOpenChange,
  onReset,
}: MultiSelectDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const ref = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [setOpen]);

  return (
    <div className={`flex flex-col w-full min-w-0 gap-0 ${open ? "relative z-50" : "relative"}`}>
      {!hideLabel && <span className={labelClass}>{label}</span>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={inputClass}
      >
        <div className="flex items-left gap-2 w-full min-w-0">
          {selected.length > 0 ? (
            <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
              {selected.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center mr-0 px-2 py-0.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="flex-1 min-w-0 truncate text-text-muted">
              {placeholder}
            </span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <FilterPopover
          label={label}
          onReset={onReset}
          hasValue={selected.length > 0}
          panelWidthClass={panelWidthClass}
        >
          <div className={`bg-white rounded-2xl max-h-[320px] overflow-y-auto px-4 py-2 grid ${columns === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1 max-[640px]:grid-cols-1`}>
            {options.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-bg-subtle rounded px-2 -mx-2 transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => onToggle(item)}
                  className="w-3.5 h-3.5 accent-accent cursor-pointer"
                />
                <span className="text-[13px] text-text-secondary tracking-[-0.13px]">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </FilterPopover>
      )}
    </div>
  );
}
