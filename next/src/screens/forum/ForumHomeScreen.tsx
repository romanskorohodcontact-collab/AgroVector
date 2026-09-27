import Link from "next/link";
import type { ReactNode } from "react";
import {
  formatRepliesLabel,
  formatThreadsLabel,
  type ForumSectionSlug,
} from "@/entities/forum/model";
import { ThreadItem, toThreadItemProps } from "@/entities/forum/ui";
import { ForumSearchBox } from "@/features/forum-search/ForumSearchBox";
import { getHomeData } from "@/server/modules/forum";

const ICONS: Record<ForumSectionSlug, ReactNode> = {
  discussion: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a8 8 0 0 1-8 8H4l2-2a8 8 0 1 1 15-6Z" />
    </svg>
  ),
  "platform-issues": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  proposals: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="m3 12 3 3 3-3-3-3Z" />
      <path d="m15 12 3 3 3-3-3-3Z" />
    </svg>
  ),
  support: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  ),
};

export async function ForumHomeScreen() {
  const { sections, latestThreads } = await getHomeData();

  return (
    <div className="flex flex-col items-center">

      {/* Hero */}
      <div className="text-center pt-6">
        <span className="text-[14px] tracking-[0.08em] uppercase text-text-muted">
          Сообщество!
        </span>
        <h1 className="mt-3 text-[64px] font-medium tracking-[-4.62px] text-text-primary whitespace-normal max-md:text-[40px] max-md:tracking-[-2px]">
          Форум
        </h1>
        <p className="max-w-[640px] mx-auto mt-5 text-lg leading-[1.78] tracking-[-0.18px] text-text-secondary">
          Обсуждения перевозок, обмен опытом и помощь по платформе AgroRunok.
          Задавайте вопросы, делитесь кейсами и предлагайте идеи развития.
        </p>

        {/* Toolbar */}
        <div className="flex items-center gap-3 max-w-[640px] mx-auto mt-7 max-md:flex-col max-md:items-stretch">
          <ForumSearchBox
            withSuggestions
            submitLabel="Найти"
            height="lg"
            panelWidthClass="w-[640px] max-w-[calc(100vw-32px)]"
            className="flex-1 min-w-0"
          />
          <Link
            href="/forum/new"
            className="inline-flex items-center justify-center h-12 px-[21px] rounded-pill bg-accent text-base font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap max-md:w-full"
          >
            Создать тему
          </Link>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4 mt-9 w-full max-lg:grid-cols-1">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/forum/${section.slug}`}
            className="flex flex-col gap-2 p-6 rounded-[24px] bg-bg-subtle hover:bg-[#F1F1F1]"
          >
            {/*<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface text-accent">
              {ICONS[section.slug]}
            </span>*/}
            <span className="text-[20px] font-medium leading-[1.25] tracking-[-0.7px] text-text-primary">
              {section.title}
            </span>
            <span className="text-[14px] leading-[1.43] tracking-[-0.14px] text-text-secondary">
              {section.description}
            </span>
            <span className="mt-auto text-[12px] tracking-[-0.12px] text-text-muted">
              {section.threadsCount} {formatThreadsLabel(section.threadsCount)} ·{" "}
              {section.postsCount} {formatRepliesLabel(section.postsCount)}
            </span>
          </Link>
        ))}
      </div>

      {/* Latest threads */}
      <div className="flex items-end justify-between gap-4 mt-10 w-full">
        <div>
          <h2 className="text-[18px] font-semibold leading-[1.33] tracking-[-0.18px] text-text-primary">
            Последние темы
          </h2>
          <p className="mt-1 text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
            Свежие обсуждения на форуме
          </p>
        </div>
        <Link
          href="/forum/discussion"
          className="text-[14px] leading-[1.43] tracking-[-0.14px] text-text-secondary hover:text-text-primary"
        >
          Все темы
        </Link>
      </div>

      {latestThreads.length > 0 ? (
        <div className="mt-4 border-t border-divider w-full">
          {latestThreads.map((thread) => (
            <ThreadItem key={thread.id} {...toThreadItemProps(thread)} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm tracking-[-0.14px] text-text-muted w-full">
          Пока нет ни одной темы. Создайте первую.
        </p>
      )}
    </div>
  );
}
