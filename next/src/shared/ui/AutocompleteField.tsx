"use client";

import { useState } from "react";
import { FormInputIcon } from "./FormInput";

interface AutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  id: string;
  placeholder: string;
}

export function AutocompleteField({
  value,
  onChange,
  options,
  id,
  placeholder,
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
          icon={<SearchIcon />}
        />
        {matches.length > 0 ? (
          <ul
            className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 m-0 list-none max-h-[200px] overflow-auto rounded-xl border border-[#ECECEC] bg-white py-1 shadow-lg"
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

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-primary"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5"></circle>
      <path d="m11 11 3 3"></path>
    </svg>
  );
}