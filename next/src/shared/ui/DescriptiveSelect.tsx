"use client";

import { useEffect, useRef, useState } from "react";

const inputClass =
  "h-[38px] w-full px-4 border-[1.2px] border-outline-input rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] transition-colors duration-150 focus:outline-none focus:border-accent cursor-pointer flex items-center";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

interface DescriptiveSelectProps {
  label: string;
  name: string;
  options: readonly string[];
  descriptions: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DescriptiveSelect({
  label,
  name,
  options,
  descriptions,
  value,
  onChange,
  placeholder = "Выберите",
}: DescriptiveSelectProps) {
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

  function select(item: string) {
    onChange(item);
    setOpen(false);
  }

  return (
    <div className={`flex flex-col w-full min-w-0 gap-1.5 ${open ? "relative z-50" : "relative"}`}>
      <span className={labelClass}>{label}</span>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={inputClass}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
          {value ? (
            <span className="flex-1 min-w-0 truncate text-text-primary">
              {value}
            </span>
          ) : (
            <span className="flex-1 min-w-0 truncate text-icon-subtle">
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
            className={`w-4 h-4 shrink-0 text-icon transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 border border-border rounded-2xl bg-bg-surface shadow-lg max-h-[320px] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
            <span className="text-[12px] font-normal text-text-muted tracking-[-0.14px]">
              {label}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-pill bg-bg-surface text-text-secondary transition-colors duration-150 hover:bg-bg-hover hover:text-text-primary"
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
          <div className="py-2">
            {options.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => select(item)}
                className={`w-full text-left px-4 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-bg-subtle ${
                  value === item ? "bg-bg-subtle" : ""
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
        </div>
      )}
    </div>
  );
}