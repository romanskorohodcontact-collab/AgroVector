"use client";

import { useAnchoredPopover } from "@/shared/lib/useAnchoredPopover";
import { FilterPopover } from "./FilterPopover";
import { FORM_FILTER_TRIGGER, FIELD_LABEL } from "./FormInput";

interface DescriptiveSelectPopoverProps {
  label: string;
  options: readonly string[];
  descriptions: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  panelWidthClass?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReset?: () => void;
}

export function DescriptiveSelectPopover({
  label,
  options,
  descriptions,
  value,
  onChange,
  placeholder = "Выберите",
  hideLabel = false,
  panelWidthClass,
  open: controlledOpen,
  onOpenChange,
  onReset,
}: DescriptiveSelectPopoverProps) {
  const { open, setOpen, toggle, anchorRef, panelRef, placement } =
    useAnchoredPopover({
      panelMaxHeight: 320,
      open: controlledOpen,
      onOpenChange,
    });

  function select(item: string) {
    onChange(item);
    setOpen(false);
  }

  return (
    <div
      ref={anchorRef}
      className={`flex flex-col w-full min-w-0 gap-0 ${open ? "relative z-50" : "relative"}`}
    >
      {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}

      <button
        type="button"
        onClick={toggle}
        aria-label={hideLabel ? label : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={FORM_FILTER_TRIGGER}
      >

        <div className="flex justify-between items-center gap-2 w-full min-w-0">
          {value ? (
            <span className="truncate text-text-primary">
              {value}
            </span>
          ) : (
            <span className="truncate text-icon-subtle">
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
            className={`w-4 h-4 shrink-0 text-icon transition-transform duration-150 ${open ? "rotate-180" : ""
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
            hasValue={value !== ""}
            panelWidthClass={panelWidthClass}
            panelRef={panelRef}
            placement={placement}
          >
            <div
              role="radiogroup"
              className="bg-bg-surface rounded-2xl max-h-[320px] overflow-y-auto py-2"
            >
              {options.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={value === item}
                  onClick={() => select(item)}
                  className={`w-full text-left px-4 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-bg-subtle ${value === item ? "bg-bg-subtle" : ""
                    }`}
                >
                  <span className="block text-[14px] font-medium text-text-primary tracking-[-0.14px]">
                    {item}
                  </span>
                  {descriptions[item] ? (
                    <span className="block mt-0.5 text-[12px] leading-[1.4] text-text-muted tracking-[-0.12px]">
                      {descriptions[item]}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </FilterPopover>
        </>
      )}
    </div>
  );
}
