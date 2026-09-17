"use client";

import { useEffect, useRef, useState } from "react";
import { DistrictRegionSelector } from "./DistrictRegionSelector";

const triggerClass =
  "h-[38px] w-full px-4 border-[1.2px] border-[#0D0D0D0D] rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer flex items-center";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface DistrictRegionSelectorPopoverProps {
  label: string;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  onToggleDistrict: (district: string) => void;
}

export function DistrictRegionSelectorPopover({
  label,
  selectedRegions,
  onToggleRegion,
  onToggleDistrict,
}: DistrictRegionSelectorPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div className={`flex flex-col w-full min-w-0 gap-1.5 ${open ? "relative z-50" : "relative"}`}>
      <span className={labelClass}>{label}</span>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClass}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
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
            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 min-w-[360px] max-w-[90vw]">
          <DistrictRegionSelector
            selectedRegions={selectedRegions}
            onToggleRegion={onToggleRegion}
            onToggleDistrict={onToggleDistrict}
          />
        </div>
      )}
    </div>
  );
}
