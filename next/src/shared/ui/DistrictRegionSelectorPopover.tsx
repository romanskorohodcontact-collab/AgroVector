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
  const { open, setOpen, toggle, anchorRef, panelRef, placement } =
    useAnchoredPopover({
      panelMaxHeight: 370,
      open: controlledOpen,
      onOpenChange,
    });

  return (
    <div
      ref={anchorRef}
      className={`flex flex-col w-full min-w-0 gap-0 ${open ? "relative z-50" : "relative"}`}
    >

      {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={FORM_FILTER_TRIGGER}
      >

        <div className="flex justify-between items-center gap-2 w-full min-w-0">

          {selectedRegions.length > 0 ? (
            <div className="overflow-hidden whitespace-nowrap text-ellipsis">
              {selectedRegions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center mr-1.5 px-2 py-0.5 rounded-pill bg- bg-surface text-xs text-text-primary tracking-[-0.16px] whitespace-nowrap"
                >
                  {region}
                </span>
              ))}
            </div>
          ) : (
            <span className="flex-1 min-w-0 truncate text-left text-icon-subtle">
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
