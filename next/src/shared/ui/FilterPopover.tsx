"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";

interface FilterPopoverProps {
  label: string;
  children: ReactNode;
  onReset?: () => void;
  hasValue?: boolean;
  panelWidthClass?: string;
  panelStyle?: CSSProperties;
  panelRef?: RefObject<HTMLDivElement | null>;
  placement?: "bottom" | "top";
}

export function FilterPopover({
  label,
  children,
  onReset,
  hasValue = false,
  panelWidthClass,
  panelStyle,
  panelRef,
  placement = "bottom",
}: FilterPopoverProps) {
  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`absolute left-0 z-50 rounded-2xl border border-border bg-white p-1 ${
        placement === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
      } ${panelWidthClass ?? "max-w-[90vw] min-w-[360px]"}`}
    >
      <div className="flex items-center justify-between rounded-t-2xl px-4 pt-1.5 pb-1.5">
        <span className="pt-2 text-[12px] font-medium tracking-[-0.12px] text-text-muted">
          {label}
        </span>
        {onReset && hasValue && (
          <button
            type="button"
            onClick={onReset}
            className="h-6 cursor-pointer rounded-pill bg-accent-orange px-2 text-xs font-medium tracking-[-0.12px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-orange/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
          >
            Сбросить
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
