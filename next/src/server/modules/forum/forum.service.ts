import {
  FORUM_SECTIONS,
  getForumSection,
  isForumSectionSlug,
  type ForumHomeData,
  type ForumPost,
  type ForumSearchResult,
  type ForumSearchIndex,
  type ForumSearchType,
  type ForumSection,
  type ForumSectionPage,
  type ForumSectionSlug,
  type ForumThread,
  type ForumThreadSummary,
  type ForumThreadView,
} from "@/entities/forum/model";
import type { User } from "@/entities/user/model";
import {
  createPost as repositoryCreatePost,
  createThread as repositoryCreateThread,
  getThreadBody as repositoryGetThreadBody,
  getThreadById as repositoryGetThreadById,
  incrementThreadViews as repositoryIncrementThreadViews,
  listAllThreads as repositoryListAllThreads,
  listLatestThreads as repositoryListLatestThreads,
  listPostsByThread as repositoryListPostsByThread,
  listSectionsWithStats as repositoryListSectionsWithStats,
  listThreadSummaries as repositoryListThreadSummaries,
  searchThreads as repositorySearchThreads,
  type SectionStats,
} from "@/server/repositories/forum.repository";
import { validatePostInput, validateThreadInput } from "@/server/validators/forum.validator";

const HOME_LATEST_LIMIT = 4;
const SECTION_PAGE_LIMIT = 10;
const POST_PAGE_LIMIT = 10;
const SEARCH_PAGE_LIMIT = 10;

export async function getHomeData(): Promise<ForumHomeData> {
  const [stats, latestThreads] = await Promise.all([
    repositoryListSectionsWithStats(),
    repositoryListLatestThreads(HOME_LATEST_LIMIT),
  ]);
  return {
    sections: buildSections(stats),
    latestThreads,
  };
}

export async function getSectionPage(
  section: string,
  page = 1,
  limit = SECTION_PAGE_LIMIT,
): Promise<ForumSectionPage | null> {
  if (!isForumSectionSlug(section)) return null;
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const [stats, { items, total }] = await Promise.all([
    repositoryListSectionsWithStats(),
    repositoryListAllThreads({ section }, safePage, safeLimit),
  ]);
  const meta = buildSections(stats).find((item) => item.slug === section);
  return {
    section: meta ?? emptySection(section),
    items,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / safeLimit)),
  };
}

export async function getSectionIndex(
  section: string,
): Promise<{ section: ForumSection; threads: ForumThread[] } | null> {
  if (!isForumSectionSlug(section)) return null;
  const [stats, { items }] = await Promise.all([
    repositoryListSectionsWithStats(),
    repositoryListAllThreads({ section }),
  ]);
  const meta = buildSections(stats).find((item) => item.slug === section);
  return {
    section: meta ?? emptySection(section),
    threads: items,
  };
}

export async function getThread(
  id: string,
  page = 1,
  limit = POST_PAGE_LIMIT,
): Promise<ForumThreadView | null> {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const [thread, { items, total }, body] = await Promise.all([
    repositoryGetThreadById(id),
    repositoryListPostsByThread(id, safePage, safeLimit),
    repositoryGetThreadBody(id),
  ]);
  if (!thread || body === null) return null;
  return {
    ...thread,
    body,
    posts: items,
    postTotal: total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / safeLimit)),
  };
}

export async function createThread(input: unknown, user: User): Promise<ForumThread> {
  const data = validateThreadInput(input);
  return repositoryCreateThread({
    section: data.section,
    title: data.title,
    body: data.body,
    tags: data.tags,
    authorId: user.id,
    authorName: displayName(user),
  });
}

export async function replyToThread(
  id: string,
  input: unknown,
  user: User,
): Promise<ForumPost | null> {
  const data = validatePostInput(input);
  const thread = await repositoryGetThreadById(id);
  if (!thread) return null;
  return repositoryCreatePost({
    threadId: id,
    text: data.text,
    authorId: user.id,
    authorName: displayName(user),
  });
}

export async function getSearchIndex(): Promise<ForumSearchIndex> {
  const [stats, { items }] = await Promise.all([
    repositoryListSectionsWithStats(),
    repositoryListAllThreads(),
  ]);
  return {
    sections: buildSections(stats),
    threads: items,
  };
}

export async function search(
  query: string,
  type: ForumSearchType = "all",
  page = 1,
  limit = SEARCH_PAGE_LIMIT,
): Promise<ForumSearchResult> {
  const text = query.trim();
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const [stats, threadResult] = await Promise.all([
    repositoryListSectionsWithStats(),
    type === "sections"
      ? Promise.resolve({ items: [] as ForumThread[], total: 0 })
      : text
        ? repositorySearchThreads(text, safePage, safeLimit)
        : repositoryListAllThreads({}, safePage, safeLimit),
  ]);
  const sections =
    type === "threads"
      ? []
      : buildSections(stats).filter(
          (section) => !text || section.title.toLowerCase().includes(text.toLowerCase()),
        );
  return {
    sections,
    threads: threadResult.items,
    threadTotal: threadResult.total,
    total: sections.length + threadResult.total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(threadResult.total / safeLimit)),
  };
}

export function incrementThreadViews(id: string): Promise<void> {
  return repositoryIncrementThreadViews(id);
}

export function getThreadSummaries(): Promise<ForumThreadSummary[]> {
  return repositoryListThreadSummaries();
}

function buildSections(stats: SectionStats[]): ForumSection[] {
  const bySlug = new Map(stats.map((item) => [item.slug, item]));
  return FORUM_SECTIONS.map((option) => {
    const stat = bySlug.get(option.slug);
    return {
      slug: option.slug,
      title: option.title,
      description: option.description,
      threadsCount: stat?.threadsCount ?? 0,
      postsCount: stat?.postsCount ?? 0,
    };
  });
}

function emptySection(slug: ForumSectionSlug): ForumSection {
  const option = getForumSection(slug);
  return {
    slug,
    title: option?.title ?? slug,
    description: option?.description ?? "",
    threadsCount: 0,
    postsCount: 0,
  };
}

function displayName(user: User): string {
  return user.name?.trim() || user.companyName?.trim() || user.phone;
}
