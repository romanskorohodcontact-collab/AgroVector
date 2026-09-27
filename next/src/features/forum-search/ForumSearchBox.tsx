"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  getForumSection,
  type ForumThreadSummary,
} from "@/entities/forum/model";
import { useAnchoredPopover } from "@/shared/lib/useAnchoredPopover";
import { FilterPopover } from "@/shared/ui/FilterPopover";
import { fetchForumThreadSummaries } from "./api";

interface ForumSearchBoxProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  height?: "md" | "lg";
  className?: string;
  withSuggestions?: boolean;
  submitLabel?: string;
  panelWidthClass?: string;
}

export function ForumSearchBox({
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  onSubmit,
  placeholder = "Поиск по форуму",
  height = "md",
  className = "",
  withSuggestions = false,
  submitLabel,
  panelWidthClass = "w-full",
}: ForumSearchBoxProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const summariesQuery = useQuery<ForumThreadSummary[]>({
    queryKey: ["forum-thread-summaries"],
    queryFn: fetchForumThreadSummaries,
    staleTime: 5 * 60 * 1000,
    enabled: withSuggestions,
  });

  const { open, setOpen, openWithScroll, anchorRef, panelRef, placement } =
    useAnchoredPopover({
      panelMaxHeight: 320,
      alignAnchorTop: true,
    });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (onSubmit) {
      onSubmit(query);
      return;
    }
    router.push(
      query ? `/forum/search?q=${encodeURIComponent(query)}` : "/forum/search"
    );
  }

  const trimmed = value.trim().toLowerCase();
  const summaries = summariesQuery.data ?? [];
  const matches = trimmed
    ? summaries.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      )
    : summaries;

  const heightClass = height === "lg" ? "h-12" : "h-10";

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex items-center gap-3 min-w-0 ${className}`}
    >
      <div
        ref={anchorRef}
        className={`relative flex-1 min-w-0 ${open ? "z-50" : ""}`}
      >
        <div
          className={`flex items-center gap-3 px-4 rounded-pill border border-outline-input bg-bg-surface focus-within:border-accent ${heightClass}`}
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
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={withSuggestions ? () => openWithScroll() : undefined}
            onClick={withSuggestions ? () => openWithScroll() : undefined}
            placeholder={placeholder}
            className="flex-1 min-w-0 border-0 bg-transparent outline-none text-sm leading-[1.43] tracking-[-0.14px] text-text-primary placeholder:text-icon-subtle"
            autoComplete="off"
            aria-label={placeholder}
          />
        </div>

        {withSuggestions && open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <FilterPopover
              label="Темы форума"
              panelWidthClass={panelWidthClass}
              panelRef={panelRef}
              placement={placement}
            >
              <div
                role="listbox"
                className="bg-bg-surface rounded-2xl max-h-[320px] overflow-y-auto py-2"
              >
                {matches.length > 0 ? (
                  matches.map((thread) => (
                    <button
                      key={thread.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/forum/${thread.section}/${thread.id}`);
                      }}
                      className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-bg-subtle"
                    >
                      <span className="block text-[14px] font-medium text-text-primary tracking-[-0.14px]">
                        {thread.title}
                      </span>
                      <span className="block mt-0.5 text-[12px] leading-[1.4] text-text-muted tracking-[-0.12px]">
                        {getForumSection(thread.section)?.title ?? thread.section}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-[13px] leading-[1.4] text-text-muted tracking-[-0.13px]">
                    Ничего не найдено
                  </p>
                )}
              </div>
            </FilterPopover>
          </>
        )}
      </div>

      {submitLabel && (
        <button
          type="submit"
          className="relative z-50 inline-flex items-center justify-center h-12 px-[21px] rounded-pill bg-accent-soft text-base font-medium text-accent tracking-[-0.16px] leading-none whitespace-nowrap transition-colors duration-150 hover:text-accent-hover"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
