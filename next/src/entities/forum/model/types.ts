export type ForumSectionSlug =
  | "discussion"
  | "platform-issues"
  | "proposals"
  | "support";

export interface ForumAuthor {
  id?: string;
  name: string;
  initials: string;
}

export interface ForumSection {
  slug: ForumSectionSlug;
  title: string;
  description: string;
  threadsCount: number;
  postsCount: number;
}

export interface ForumThread {
  id: string;
  section: ForumSectionSlug;
  title: string;
  author: ForumAuthor;
  tags: string[];
  isPinned: boolean;
  isClosed: boolean;
  viewsCount: number;
  repliesCount: number;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface ForumPost {
  id: string;
  threadId: string;
  author: ForumAuthor;
  text: string;
  createdAt: Date;
}

export interface ForumThreadView extends ForumThread {
  body: string;
  posts: ForumPost[];
  postTotal: number;
  page: number;
  pageCount: number;
}

export interface ForumThreadSummary {
  id: string;
  title: string;
  section: ForumSectionSlug;
  tags: string[];
}

export interface ForumHomeData {
  sections: ForumSection[];
  latestThreads: ForumThread[];
}

export interface ForumSectionPage {
  section: ForumSection;
  items: ForumThread[];
  total: number;
  page: number;
  pageCount: number;
}

export interface ForumSearchResult {
  sections: ForumSection[];
  threads: ForumThread[];
  threadTotal: number;
  total: number;
  page: number;
  pageCount: number;
}

export interface ForumSearchIndex {
  sections: ForumSection[];
  threads: ForumThread[];
}

export type ForumSearchType = "all" | "threads" | "sections";
