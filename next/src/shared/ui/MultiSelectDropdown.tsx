"use client";

import { useEffect, useRef, useState } from "react";

const inputClass =
  "h-[38px] w-full px-4 border-[1.2px] border-[#0D0D0D0D] rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer flex items-center";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface MultiSelectDropdownProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
  placeholder?: string;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  placeholder = "Выберите",
}: MultiSelectDropdownProps) {
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
        className={inputClass}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
          {selected.length > 0 ? (
            <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
              {selected.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center mr-1.5 px-2 py-0.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="flex-1 min-w-0 truncate text-text-muted">
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
            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 border border-[#ECECEC] rounded-2xl bg-white shadow-lg max-h-[320px] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC] bg-bg-subtle">
            <span className="text-[12px] font-normal text-text-muted tracking-[-0.14px]">
              {label}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-pill bg-white text-text-secondary transition-colors duration-150 hover:bg-[#EFEFEF] hover:text-text-primary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="px-4 py-2 grid grid-cols-2 gap-1 max-[640px]:grid-cols-1">
            {options.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-bg-subtle rounded px-2 -mx-2 transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => onToggle(item)}
                  className="w-3.5 h-3.5 accent-accent cursor-pointer"
                />
                <span className="text-[13px] text-text-secondary tracking-[-0.13px]">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
