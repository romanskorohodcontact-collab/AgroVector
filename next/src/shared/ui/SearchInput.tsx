interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Поиск",
  defaultValue,
  className,
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-3 h-10 w-full max-w-[420px] px-4 rounded-pill border border-outline-input bg-bg-surface focus-within:border-accent ${className ?? ""}`}
      role="search"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="flex-none text-icon-subtle"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="flex-1 min-w-0 border-0 bg-transparent outline-none text-sm leading-[1.43] tracking-[-0.14px] text-text-primary placeholder:text-icon-subtle"
        autoComplete="off"
      />
    </div>
  );
}
