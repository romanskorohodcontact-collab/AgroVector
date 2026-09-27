"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  FORUM_SEARCH_PAGE_LIMIT,
  filterSections,
  filterThreads,
  formatRepliesLabel,
  formatResultsLabel,
  formatSectionsLabel,
  formatThreadsLabel,
  type ForumSearchType,
  type ForumSection,
  type ForumThread,
} from "@/entities/forum/model";
import { ThreadItem, toThreadItemProps } from "@/entities/forum/ui";
import { Pager } from "@/shared/ui/Pager";
import { ForumSearchBox } from "./ForumSearchBox";

interface ForumSearchResultsProps {
  sections: ForumSection[];
  threads: ForumThread[];
  initialQuery: string;
  initialType: ForumSearchType;
  initialPage: number;
}

const FILTERS: { value: ForumSearchType; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "threads", label: "Темы" },
  { value: "sections", label: "Разделы" },
];

const BASE = "inline-flex items-center h-8 px-4 rounded-pill text-sm";
const IDLE = `${BASE} bg-bg-surface border-[0.8px] border-outline text-text-secondary hover:border-outline-hover hover:text-text-primary`;
const ACTIVE = `${BASE} bg-accent border-[0.8px] border-accent text-text-inverse`;

export function ForumSearchResults({
  sections,
  threads,
  initialQuery,
  initialType,
  initialPage,
}: ForumSearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<ForumSearchType>(initialType);
  const [page, setPage] = useState(initialPage);

  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;
  const trimmed = deferredQuery.trim();

  const filteredSections = useMemo(
    () => filterSections(sections, deferredQuery),
    [sections, deferredQuery]
  );
  const filteredThreads = useMemo(
    () => filterThreads(threads, deferredQuery),
    [threads, deferredQuery]
  );

  const pageCount = Math.max(
    1,
    Math.ceil(filteredThreads.length / FORUM_SEARCH_PAGE_LIMIT)
  );
  const safePage = Math.min(Math.max(1, page), pageCount);
  const pageThreads = filteredThreads.slice(
    (safePage - 1) * FORUM_SEARCH_PAGE_LIMIT,
    safePage * FORUM_SEARCH_PAGE_LIMIT
  );

  const showSections = type !== "threads" && filteredSections.length > 0;
  const showThreads = type !== "sections" && pageThreads.length > 0;
  const hasVisible =
    (type !== "sections" && filteredThreads.length > 0) ||
    (type !== "threads" && filteredSections.length > 0);

  const foundTotal =
    (type === "sections" ? 0 : filteredThreads.length) +
    (type === "threads" ? 0 : filteredSections.length);

  const counterText = trimmed
    ? `Найдено: ${foundTotal} ${formatResultsLabel(foundTotal)}`
    : type === "sections"
      ? `Всего: ${filteredSections.length} ${formatSectionsLabel(filteredSections.length)}`
      : `Всего: ${filteredThreads.length} ${formatThreadsLabel(filteredThreads.length)}`;

  function syncUrl(
    nextQuery: string,
    nextType: ForumSearchType,
    nextPage: number
  ) {
    const params = new URLSearchParams();
    const text = nextQuery.trim();
    if (text) params.set("q", text);
    if (nextType !== "all") params.set("type", nextType);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `/forum/search${search ? `?${search}` : ""}`
    );
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
    syncUrl(next, type, 1);
  }

  function handleTypeChange(next: ForumSearchType) {
    setType(next);
    setPage(1);
    syncUrl(query, next, 1);
  }

  function handlePageChange(next: number) {
    setPage(next);
    syncUrl(query, type, next);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-[640px] w-full flex items-center gap-3">
        <ForumSearchBox
          value={query}
          onValueChange={handleQueryChange}
          onSubmit={handleQueryChange}
          height="lg"
          placeholder="Поиск по форуму"
          submitLabel="Найти"
          className="flex-1 min-w-0"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-5 w-full">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleTypeChange(filter.value)}
            className={type === filter.value ? ACTIVE : IDLE}
          >
            {filter.label}
          </button>
        ))}
        <span className="ml-auto text-sm leading-[1.43] tracking-[-0.14px] text-text-muted">
          {counterText}
        </span>
      </div>

      <div
        className={`w-full transition-opacity duration-150 ${
          isStale ? "opacity-60" : ""
        }`}
      >
        {!hasVisible && trimmed && (
          <p className="w-full mt-7 text-sm tracking-[-0.14px] text-text-muted">
            По запросу «{query.trim()}» ничего не найдено.
          </p>
        )}

        {!hasVisible && !trimmed && (
          <p className="w-full mt-7 text-sm tracking-[-0.14px] text-text-muted">
            В Сообществе пока нет тем.
          </p>
        )}

        {showSections && (
          <div className="w-full mt-7">
            <h2 className="text-[12px] font-semibold tracking-[0.06em] uppercase text-text-muted">
              Разделы
            </h2>
            <div className="mt-3 border-t border-divider">
              {filteredSections.map((section) => (
                <Link
                  key={section.slug}
                  href={`/forum/${section.slug}`}
                  className="flex items-center justify-between gap-6 py-4 px-2 border-b border-divider hover:bg-bg-subtle"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <h3 className="text-base font-medium leading-[1.38] tracking-[-0.16px] text-text-primary">
                      {section.title}
                    </h3>
                    <p className="text-sm leading-[1.43] tracking-[-0.14px] text-text-muted">
                      {section.threadsCount}{" "}
                      {formatThreadsLabel(section.threadsCount)} ·{" "}
                      {section.postsCount}{" "}
                      {formatRepliesLabel(section.postsCount)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {showThreads && (
          <div className="w-full mt-7">
            <h2 className="text-[12px] font-semibold tracking-[0.06em] uppercase text-text-muted">
              Темы
            </h2>
            <div className="mt-3 border-t border-divider">
              {pageThreads.map((thread) => (
                <ThreadItem key={thread.id} {...toThreadItemProps(thread)} />
              ))}
            </div>
            <Pager
              page={safePage}
              pageCount={pageCount}
              onSelect={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
