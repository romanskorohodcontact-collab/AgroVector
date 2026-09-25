"use client";

import { useState } from "react";
import { FIELD_LABEL, FormInputIcon } from "./FormInput";

interface AutocompleteFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  id: string;
  placeholder: string;
  hideLabel?: boolean;
}

export function AutocompleteField({
  label,
  value,
  onChange,
  options,
  id,
  placeholder,
  hideLabel = false
}: AutocompleteFieldProps) {
  const [open, setOpen] = useState(false);
  const trimmed = value.trim().toLowerCase();
  const matches =
    open && trimmed
      ? options
          .filter((option) => option.toLowerCase().includes(trimmed))
          .slice(0, 8)
      : [];

  return (
    <div className="min-w-0">
      <div className="relative">
        {!hideLabel && <span className={FIELD_LABEL}>{label}</span>}
        <FormInputIcon
          id={id}
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          placeholder={placeholder}
          autoComplete="off"
          icon={null}
        />
        {matches.length > 0 ? (
          <ul
            className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 m-0 list-none max-h-[200px] overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
            onMouseDown={(event) => event.preventDefault()}
          >
            {matches.map((option) => (
              <li
                key={option}
                onMouseDown={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px] cursor-pointer hover:bg-bg-subtle hover:text-text-primary"
              >
                {option}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
