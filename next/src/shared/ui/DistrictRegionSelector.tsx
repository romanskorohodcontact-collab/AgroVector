"use client";

import { useState } from "react";
import { WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

const labelClass = "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface DistrictRegionSelectorProps {
  label?: string;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  onToggleDistrict: (district: string) => void;
  single?: boolean;
}

export function DistrictRegionSelector({
  label,
  selectedRegions,
  onToggleRegion,
  onToggleDistrict,
  single = false,
}: DistrictRegionSelectorProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpand(district: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(district)) {
        next.delete(district);
      } else {
        next.add(district);
      }
      return next;
    });
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <span className={labelClass}>{label}</span>}
      <div className="max-h-[370px] overflow-y-auto rounded-2xl border border-border bg-bg-surface">
        {Object.entries(WORK_DISTRICTS_REGIONS).map(([district, regions]) => {
          const isExpanded = expanded.has(district);
          const selectedCount = regions.filter((r) => selectedRegions.includes(r)).length;
          const allSelected = selectedCount === regions.length && regions.length > 0;
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div key={district} className="border-b border-border last:border-b-0">
              <div className="flex items-center gap-2 bg-bg-subtle px-4 py-3">
                {!single && (
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleDistrict(district)}
                    className="h-4 w-4 cursor-pointer accent-accent"
                  />
                )}

                <button
                  type="button"
                  onClick={() => toggleExpand(district)}
                  className="flex-1 cursor-pointer text-left text-[14px] font-medium tracking-[-0.14px] text-text-primary"
                >
                  {district}
                  {someSelected && (
                    <span className="ml-2 text-[12px] text-text-muted">
                      ({selectedCount}/{regions.length})
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpand(district)}
                  className="text-icon transition-colors duration-150 hover:text-text-primary"
                  aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <path d="m4 6 4 4 4-4" />
                  </svg>
                </button>
              </div>
              {isExpanded && single && (
                <div className="flex flex-wrap gap-2 px-4 py-2.5">
                  {regions.map((region) => {
                    const active = selectedRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => onToggleRegion(region)}
                        aria-pressed={active}
                        className={`inline-flex cursor-pointer items-center rounded-pill px-[10px] py-[5px] text-[12px] whitespace-nowrap transition-colors duration-150 ${
                          active
                            ? "bg-accent text-text-inverse"
                            : "bg-bg-subtle text-text-secondary hover:bg-bg-hover"
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              )}
              {isExpanded && !single && (
                <div className="grid grid-cols-2 gap-1 px-4 py-2 max-[640px]:grid-cols-1">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="-mx-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors duration-150 hover:bg-bg-subtle"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region)}
                        onChange={() => onToggleRegion(region)}
                        className="h-3.5 w-3.5 cursor-pointer accent-accent"
                      />
                      <span className="text-[13px] tracking-[-0.13px] text-text-secondary">
                        {region}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
