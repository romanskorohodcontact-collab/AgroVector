"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  getForumSection,
  isForumSectionSlug,
  type ForumThreadSummary,
} from "@/entities/forum/model";
import { fetchForumThreadSummaries } from "@/features/forum-search/api";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

interface Crumb {
  href: string;
  label: string;
}

export function ForumBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1];
  const threadId = segments[2];
  const isThreadPage =
    segments[0] === "forum" &&
    !!section &&
    isForumSectionSlug(section) &&
    !!threadId;

  const summariesQuery = useQuery<ForumThreadSummary[]>({
    queryKey: ["forum-thread-summaries"],
    queryFn: fetchForumThreadSummaries,
    staleTime: 5 * 60 * 1000,
    enabled: isThreadPage,
  });

  const crumbs = buildCrumbs({
    segments,
    section,
    threadId,
    threadTitle: threadId
      ? summariesQuery.data?.find((item) => item.id === threadId)?.title
      : undefined,
  });

  if (!crumbs) return null;

  return (
    <div className="mb-4">
      <Breadcrumbs items={crumbs.items} current={crumbs.current} />
    </div>
  );
}

function buildCrumbs({
  segments,
  section,
  threadId,
  threadTitle,
}: {
  segments: string[];
  section?: string;
  threadId?: string;
  threadTitle?: string;
}): { items: Crumb[]; current: string } | null {
  if (segments[0] !== "forum" || segments.length === 1) {
    return null;
  }

  const root: Crumb = { href: "/forum", label: "Сообщество" };

  if (segments[1] === "new") {
    return { items: [root], current: "Новая тема" };
  }

  if (segments[1] === "search") {
    return { items: [root], current: "Поиск по темам" };
  }

  if (!section || !isForumSectionSlug(section)) {
    return null;
  }

  const sectionTitle = getForumSection(section)?.title ?? section;

  if (threadId) {
    return {
      items: [root, { href: `/forum/${section}`, label: sectionTitle }],
      current: threadTitle ?? "…",
    };
  }

  return { items: [root], current: sectionTitle };
}
