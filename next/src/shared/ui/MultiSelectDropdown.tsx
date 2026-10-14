"use client";

import { useCallback, useState } from "react";
import { usePopoverDismiss } from "@/shared/lib/usePopoverDismiss";
import { FilterPopover } from "./FilterPopover";
import { FORM_FILTER_TRIGGER, FIELD_LABEL } from "./FormInput";

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

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange],
  );

  usePopoverDismiss(open, () => setOpen(false));

  return (
    <div className={`flex w-full min-w-0 flex-col gap-0 ${open ? "relative z-50" : "relative"}`}>
      {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={FORM_FILTER_TRIGGER}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          {selected.length > 0 ? (
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {selected.map((item) => (
                <span
                  key={item}
                  className="bg -bg-surface mr-0 inline-flex items-center rounded-pill px-2 py-0.5 text-xs tracking-[-0.16px] whitespace-nowrap text-text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="truncate text-icon-subtle">{placeholder}</span>
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
            className={`h-4 w-4 shrink-0 text-icon transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-bg-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <FilterPopover
            label={label}
            onReset={onReset}
            hasValue={selected.length > 0}
            panelWidthClass={panelWidthClass}
          >
            <div
              className={`grid max-h-[320px] overflow-y-auto rounded-2xl bg-bg-surface px-4 py-2 ${columns === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1 max-[640px]:grid-cols-1`}
            >
              {options.map((item) => (
                <label
                  key={item}
                  className="-mx-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors duration-150 hover:bg-bg-subtle"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => onToggle(item)}
                    className="h-3.5 w-3.5 cursor-pointer accent-accent"
                  />
                  <span className="text-[13px] tracking-[-0.13px] text-text-secondary">{item}</span>
                </label>
              ))}
            </div>
          </FilterPopover>
        </>
      )}
    </div>
  );
}
