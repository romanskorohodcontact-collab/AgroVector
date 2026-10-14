"use client";

import type { ReactNode } from "react";

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export function ToggleField({ label, checked, onChange, children }: ToggleFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] tracking-[-0.13px] text-text-secondary select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-3.5 w-3.5 cursor-pointer accent-accent"
        />
        {label}
      </label>
      {checked ? children : null}
    </div>
  );
}
