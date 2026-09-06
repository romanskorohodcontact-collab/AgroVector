"use client";

import { useState, type FormEvent } from "react";
import type { LoadSuggestions } from "@/entities/load/model";

export interface SearchFiltersValues {
  from?: string;
  to?: string;
  cargo?: string;
  tonnage?: string;
  rate?: string;
  distance?: string;
  company?: string;
}

interface SearchFiltersProps {
  values: SearchFiltersValues;
  onChange: (values: SearchFiltersValues) => void;
  onSubmit: () => void;
  suggestions: LoadSuggestions;
}

export function SearchFilters({
  values,
  onChange,
  onSubmit,
  suggestions,
}: SearchFiltersProps) {
  function setField(key: keyof SearchFiltersValues, value: string) {
    onChange({ ...values, [key]: value });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        margin: "16px",
        padding: "16px",
        border: "1px solid #000",
      }}
    >
      <AutocompleteField
        value={values.from ?? ""}
        onChange={(value) => setField("from", value)}
        options={suggestions.loadingPlaces}
        placeholder="Откуда"
      />
      <AutocompleteField
        value={values.to ?? ""}
        onChange={(value) => setField("to", value)}
        options={suggestions.unloadingPlaces}
        placeholder="Куда"
      />
      <AutocompleteField
        value={values.cargo ?? ""}
        onChange={(value) => setField("cargo", value)}
        options={suggestions.cargo}
        placeholder="Тип груза"
      />
      <div style={fieldWrapperStyle}>
        <input
          value={values.tonnage ?? ""}
          onChange={(event) => setField("tonnage", event.target.value)}
          placeholder="Тоннаж от, т"
          type="number"
          min="0"
          style={inputStyle}
        />
      </div>
      <div style={fieldWrapperStyle}>
        <input
          value={values.rate ?? ""}
          onChange={(event) => setField("rate", event.target.value)}
          placeholder="Ставка от"
          type="number"
          min="0"
          style={inputStyle}
        />
      </div>
      <div style={fieldWrapperStyle}>
        <input
          value={values.distance ?? ""}
          onChange={(event) => setField("distance", event.target.value)}
          placeholder="Расстояние до, км"
          type="number"
          min="0"
          style={inputStyle}
        />
      </div>
      <CompanySelect
        value={values.company ?? ""}
        onChange={(value) => setField("company", value)}
        options={suggestions.companyNames}
      />
      <button type="submit" style={buttonStyle}>
        Найти
      </button>
    </form>
  );
}

interface AutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

function AutocompleteField({
  value,
  onChange,
  options,
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
    <div style={{ position: "relative", ...fieldWrapperStyle }}>
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {matches.length > 0 ? (
        <ul style={dropdownStyle}>
          {matches.map((option) => (
            <li
              key={option}
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(option);
                setOpen(false);
              }}
              style={optionStyle}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function CompanySelect({ value, onChange, options }: CompanySelectProps) {
  return (
    <div style={fieldWrapperStyle}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ ...inputStyle, cursor: "pointer" }}
      >
        <option value="">Все компании</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const fieldWrapperStyle: React.CSSProperties = {
  flex: "1 1 160px",
  minWidth: "160px",
};

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px solid #000",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 16px",
  border: "1px solid #000",
  background: "none",
  cursor: "pointer",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  margin: 0,
  padding: "4px 0",
  listStyle: "none",
  border: "1px solid #000",
  background: "#fff",
  zIndex: 10,
  maxHeight: "200px",
  overflow: "auto",
};

const optionStyle: React.CSSProperties = {
  padding: "6px 8px",
  cursor: "pointer",
};