"use client";

import { useCallback, useState } from "react";
import { usePopoverDismiss } from "@/shared/lib/usePopoverDismiss";
import { FilterPopover } from "./FilterPopover";
import { FORM_FILTER_TRIGGER, FIELD_LABEL } from "./FormInput";

interface DescriptiveMultiSelectProps {
  label: string;
  options: readonly string[];
  descriptions: Record<string, string>;
  selected: string[];
  onToggle: (item: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  panelWidthClass?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
}

export function DescriptiveMultiSelect({
  label,
  options,
  descriptions,
  selected,
  onToggle,
  placeholder = "Выберите",
  hideLabel = false,
  panelWidthClass,
  open: controlledOpen,
  onOpenChange,
  onReset,
}: DescriptiveMultiSelectProps) {
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
        <div className="flex w-full min-w-0 items-center gap-2">
          {selected.length > 0 ? (
            <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {selected.map((item) => (
                <span
                  key={item}
                  className="mr-0 inline-flex items-center rounded-pill bg-bg-surface px-2 py-0.5 text-xs tracking-[-0.16px] whitespace-nowrap text-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="min-w-0 flex-1 truncate text-icon-subtle">{placeholder}</span>
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
            <div className="max-h-[320px] overflow-y-auto rounded-2xl bg-bg-surface py-2">
              {options.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-start gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-bg-subtle"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => onToggle(item)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium tracking-[-0.14px] text-text-primary">
                      {item}
                    </span>
                    {descriptions[item] ? (
                      <span className="mt-0.5 block text-[12px] leading-[1.4] tracking-[-0.12px] text-text-muted">
                        {descriptions[item]}
                      </span>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </FilterPopover>
        </>
      )}
    </div>
  );
}
