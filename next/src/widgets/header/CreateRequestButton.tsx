"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BTN_ACCENT =
  "inline-flex items-center justify-center h-9 px-4 gap-1.5 rounded-pill bg-accent text-sm font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-accent/90 cursor-pointer";

interface CreateRequestOption {
  label: string;
  href: string;
}

const OPTIONS: readonly CreateRequestOption[] = [
  { label: "Выложить груз", href: "/loads/create" },
  { label: "Разместить транспорт", href: "/transports/create" },
];

export function CreateRequestButton() {
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={BTN_ACCENT}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Выложить заявку
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
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-2xl border border-[#ECECEC] bg-white shadow-lg p-1.5">
          {OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl px-3 py-2.5 text-sm text-text-primary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:bg-bg-subtle"
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
