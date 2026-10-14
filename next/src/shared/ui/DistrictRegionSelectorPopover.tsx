"use client";

import { useAnchoredPopover } from "@/shared/lib/useAnchoredPopover";
import { DistrictRegionSelector } from "./DistrictRegionSelector";
import { FilterPopover } from "./FilterPopover";
import { FORM_FILTER_TRIGGER, FIELD_LABEL } from "./FormInput";

interface DistrictRegionSelectorPopoverProps {
  label: string;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  onToggleDistrict: (district: string) => void;
  onReset?: () => void;
  hideLabel?: boolean;
  panelWidthClass?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  single?: boolean;
}

export function DistrictRegionSelectorPopover({
  label,
  selectedRegions,
  onToggleRegion,
  onToggleDistrict,
  onReset,
  hideLabel = false,
  panelWidthClass,
  open: controlledOpen,
  onOpenChange,
  single = false,
}: DistrictRegionSelectorPopoverProps) {
  const { open, setOpen, toggle, anchorRef, panelRef, placement } = useAnchoredPopover({
    panelMaxHeight: 370,
    open: controlledOpen,
    onOpenChange,
  });

  return (
    <div
      ref={anchorRef}
      className={`flex w-full min-w-0 flex-col gap-0 ${open ? "relative z-50" : "relative"}`}
    >
      {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={FORM_FILTER_TRIGGER}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          {selectedRegions.length > 0 ? (
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedRegions.map((region) => (
                <span
                  key={region}
                  className="bg- bg-surface mr-1.5 inline-flex items-center rounded-pill px-2 py-0.5 text-xs tracking-[-0.16px] whitespace-nowrap text-text-primary"
                >
                  {region}
                </span>
              ))}
            </div>
          ) : (
            <span className="min-w-0 flex-1 truncate text-left text-icon-subtle">
              {single ? "Выберите регион" : "Выберите регионы"}
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
            hasValue={selectedRegions.length > 0}
            panelWidthClass={panelWidthClass}
            panelRef={panelRef}
            placement={placement}
          >
            <DistrictRegionSelector
              selectedRegions={selectedRegions}
              onToggleRegion={onToggleRegion}
              onToggleDistrict={onToggleDistrict}
              single={single}
            />
          </FilterPopover>
        </>
      )}
    </div>
  );
}
