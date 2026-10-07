"use client";

import type { ReactNode } from "react";

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export function ToggleField({
  label,
  checked,
  onChange,
  children,
}: ToggleFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="inline-flex items-center gap-2 text-[13px] text-text-secondary tracking-[-0.13px] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-3.5 h-3.5 accent-accent cursor-pointer"
        />
        {label}
      </label>
      {checked ? children : null}
    </div>
  );
}
