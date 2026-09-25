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
}

export function FilterPopover({
  label,
  children,
  onReset,
  hasValue = false,
  panelWidthClass,
  panelStyle,
  panelRef,
}: FilterPopoverProps) {
  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`absolute top-[calc(100%+8px)] left-0 z-50 bg-bg-subtle rounded-2xl p-1 border border-border ${panelWidthClass ?? "min-w-[360px] max-w-[90vw]"
        }`}
    >

      <div className="flex items-center justify-between px-4 rounded-t-2xl pt-1.5 pb-1.5">
        <span className="text-[12px] font-medium text-text-muted tracking-[-0.12px] pt-2">
          {label}
        </span>
        {onReset && hasValue && (
          <button
            type="button"
            onClick={onReset}
            className="h-6 px-2 rounded-pill bg-accent-orange text-xs font-medium text-white tracking-[-0.12px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-accent-orange/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
          >
            Сбросить
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
