"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  FORUM_SEARCH_PAGE_LIMIT,
  filterThreads,
  formatThreadsLabel,
  type ForumSectionSlug,
  type ForumThread,
} from "@/entities/forum/model";
import { ThreadItem, toThreadItemProps } from "@/entities/forum/ui";
import { Pager } from "@/shared/ui/Pager";
import { ForumSearchBox } from "./ForumSearchBox";

interface ForumSectionResultsProps {
  threads: ForumThread[];
  sectionSlug: ForumSectionSlug;
  initialQuery: string;
  initialPage: number;
}

export function ForumSectionResults({
  threads,
  sectionSlug,
  initialQuery,
  initialPage,
}: ForumSectionResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);

  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;
  const trimmed = deferredQuery.trim();

  const filtered = useMemo(() => filterThreads(threads, deferredQuery), [threads, deferredQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / FORUM_SEARCH_PAGE_LIMIT));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const pageThreads = filtered.slice(
    (safePage - 1) * FORUM_SEARCH_PAGE_LIMIT,
    safePage * FORUM_SEARCH_PAGE_LIMIT,
  );

  const hasThreads = threads.length > 0;

  function syncUrl(nextQuery: string, nextPage: number) {
    const params = new URLSearchParams();
    const text = nextQuery.trim();
    if (text) params.set("q", text);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    window.history.replaceState(null, "", `/forum/${sectionSlug}${search ? `?${search}` : ""}`);
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
    syncUrl(next, 1);
  }

  function handlePageChange(next: number) {
    setPage(next);
    syncUrl(query, next);
  }

  return (
    <>
      <div className="mt-6 flex items-center gap-3 max-md:flex-col max-md:items-stretch">
        <ForumSearchBox
          value={query}
          onValueChange={handleQueryChange}
          onSubmit={handleQueryChange}
          placeholder="Искать в разделе"
          className="max-w-[420px] max-md:max-w-none"
        />
        <Link
          href="/forum/new"
          className="inline-flex h-9 items-center justify-center rounded-pill bg-accent px-4 text-sm font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse max-md:w-full"
        >
          Создать тему
        </Link>
        {hasThreads && (
          <span className="ml-auto text-sm leading-[1.43] tracking-[-0.14px] text-text-muted max-md:ml-0">
            {trimmed ? "Найдено" : "Всего"}: {filtered.length} {formatThreadsLabel(filtered.length)}
          </span>
        )}
      </div>

      <div className={`transition-opacity duration-150 ${isStale ? "opacity-60" : ""}`}>
        {!hasThreads && (
          <div className="mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-subtle text-text-muted">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[26px] w-[26px]"
              >
                <path d="M21 12a8 8 0 0 1-8 8H4l2-2a8 8 0 1 1 15-6Z" />
                <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
              </svg>
            </span>
            <h2 className="text-[18px] leading-[1.33] font-semibold tracking-[-0.18px] text-text-primary">
              В разделе пока нет тем
            </h2>
            <p className="max-w-[360px] text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
              Создайте первую тему, чтобы начать обсуждение. Вопросы обрабатываются в порядке
              очереди.
            </p>
            <div className="mt-2">
              <Link
                href="/forum/new"
                className="inline-flex h-9 items-center justify-center rounded-pill bg-accent px-4 text-sm font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse"
              >
                Создать тему
              </Link>
            </div>
          </div>
        )}

        {hasThreads && filtered.length === 0 && (
          <p className="mt-7 w-full text-sm tracking-[-0.14px] text-text-muted">
            По запросу «{query.trim()}» ничего не найдено.
          </p>
        )}

        {hasThreads && filtered.length > 0 && (
          <>
            <div className="mt-4 border-t border-divider">
              {pageThreads.map((thread) => (
                <ThreadItem key={thread.id} {...toThreadItemProps(thread)} />
              ))}
            </div>

            {pageCount > 1 && (
              <Pager page={safePage} pageCount={pageCount} onSelect={handlePageChange} />
            )}
          </>
        )}
      </div>
    </>
  );
}
