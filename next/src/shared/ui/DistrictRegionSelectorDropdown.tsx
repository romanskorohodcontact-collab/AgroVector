"use client";

import { useEffect, useRef, useState } from "react";
import { WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

const inputClass =
  "min-h-[38px] w-full px-4 py-2 border-[1.2px] border-outline-input rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface DistrictRegionSelectorDropdownProps {
  label: string;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  align?: "left" | "right";
}

export function DistrictRegionSelectorDropdown({
  label,
  selectedRegions,
  onToggleRegion,
  align = "left",
}: DistrictRegionSelectorDropdownProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
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
    <div className={`flex flex-col w-full gap-1.5 ${open ? "relative z-50" : "relative"}`}>

      <span className={labelClass}>{label}</span>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={inputClass}
      >

        <div className="flex items-center justify-between gap-2">

          {selectedRegions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedRegions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center px-2 py-0.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap"
                >

                  {region}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-icon-subtle">Выберите регионы</span>
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
            className={`w-4 h-4 shrink-0 text-icon transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+8px)] ${align === "right" ? "right-0" : "left-0"} w-[min(560px,calc(100vw-32px))] border border-border rounded-2xl bg-bg-surface shadow-lg max-h-[320px] overflow-y-auto`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
            <span className="text-[12px] font-normal text-text-muted tracking-[-0.14px]">
              {label}
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[14px] font-medium text-text-mute d text-danger bg-danger-soft h-9 px-4 rounded-full transition-colors duration-150 flex items-center gap-6"
              aria-label="Закрыть"
            >
              <span>Закрыть</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>

          {Object.entries(WORK_DISTRICTS_REGIONS).map(([district, regions]) => {
            const isExpanded = expanded.has(district);
            const selectedCount = regions.filter((r) =>
              selectedRegions.includes(r)
            ).length;

            return (
              <div
                key={district}
                className="border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-bg-subtle">
                  <button
                    type="button"
                    onClick={() => toggleExpand(district)}
                    className="flex-1 text-left text-[14px] font-medium text-text-primary tracking-[-0.14px] cursor-pointer"
                  >
                    {district}
                    {selectedCount > 0 && (
                      <span className="ml-2 text-[12px] text-text-muted">
                        ({selectedCount}/{regions.length})
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleExpand(district)}
                    className="text-icon hover:text-text-primary transition-colors duration-150"
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
          })}
        </div>
      )}
    </div>
  );
}
