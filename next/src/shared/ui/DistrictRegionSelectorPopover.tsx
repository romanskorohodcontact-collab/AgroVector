"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DistrictRegionSelector } from "./DistrictRegionSelector";
import { FilterPopover } from "./FilterPopover";

const triggerClass =
  "h-[38px] w-full px-4 border-[1.2px] border-[#0D0D0D0D] rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer flex items-center";

const labelClass =
  "mb-1.5 block text-[12px] font-medium text-text-muted tracking-[-0.12px]";

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
}: DistrictRegionSelectorPopoverProps) {
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
        className={triggerClass}
      >
        <div className="flex items-left gap-2 w-full min-w-0">

          {selectedRegions.length > 0 ? (
            <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
              {selectedRegions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center mr-1.5 px-2 py-0.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap"
                >
                  {region}
                </span>
              ))}
            </div>
          ) : (
            <span className="flex-1 min-w-0 truncate text-text-muted">
              Выберите регионы
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
            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""
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
          hasValue={selectedRegions.length > 0}
          panelWidthClass={panelWidthClass}
        >
          <DistrictRegionSelector
            selectedRegions={selectedRegions}
            onToggleRegion={onToggleRegion}
            onToggleDistrict={onToggleDistrict}
          />
        </FilterPopover>
      )}
    </div>
  );
}
