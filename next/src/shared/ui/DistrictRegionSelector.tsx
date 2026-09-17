"use client";

import { useState } from "react";
import { WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface DistrictRegionSelectorProps {
  label?: string;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  onToggleDistrict: (district: string) => void;
}

export function DistrictRegionSelector({
  label,
  selectedRegions,
  onToggleRegion,
  onToggleDistrict,
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
    <div className="flex flex-col gap-1.5">
      {label && <span className={labelClass}>{label}</span>}
      <div className="border border-[#ECECEC] rounded-2xl bg-white max-h-[320px] overflow-y-auto">
        {Object.entries(WORK_DISTRICTS_REGIONS).map(
          ([district, regions]) => {
            const isExpanded = expanded.has(district);
            const selectedCount = regions.filter((r) =>
              selectedRegions.includes(r)
            ).length;
            const allSelected = selectedCount === regions.length;
            const someSelected = selectedCount > 0 && !allSelected;

            return (
              <div
                key={district}
                className="border-b border-[#ECECEC] last:border-b-0"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-bg-subtle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleDistrict(district)}
                    className="w-4 h-4 accent-accent cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => toggleExpand(district)}
                    className="flex-1 text-left text-[14px] font-medium text-text-primary tracking-[-0.14px] cursor-pointer"
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
                    className="text-text-muted hover:text-text-primary transition-colors duration-150"
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
                {isExpanded && (
                  <div className="px-4 py-2 grid grid-cols-2 gap-1 max-[640px]:grid-cols-1">
                    {regions.map((region) => (
                      <label
                        key={region}
                        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-bg-subtle rounded px-2 -mx-2 transition-colors duration-150"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRegions.includes(region)}
                          onChange={() => onToggleRegion(region)}
                          className="w-3.5 h-3.5 accent-accent cursor-pointer"
                        />
                        <span className="text-[13px] text-text-secondary tracking-[-0.13px]">
                          {region}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
