import type { ForumSection, ForumThread } from "./types";

export const FORUM_SEARCH_PAGE_LIMIT = 10;

export function matchesThreadQuery(thread: ForumThread, query: string): boolean {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  if (thread.title.toLowerCase().includes(text)) return true;
  return thread.tags.some((tag) => tag.toLowerCase().includes(text));
}

export function matchesSectionQuery(section: ForumSection, query: string): boolean {
  const text = query.trim().toLowerCase();
  return !text || section.title.toLowerCase().includes(text);
}

export function filterThreads(threads: ForumThread[], query: string): ForumThread[] {
  return threads.filter((thread) => matchesThreadQuery(thread, query));
}

export function filterSections(sections: ForumSection[], query: string): ForumSection[] {
  return sections.filter((section) => matchesSectionQuery(section, query));
}
