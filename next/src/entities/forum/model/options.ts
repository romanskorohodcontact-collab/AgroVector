import type { ForumSectionSlug } from "./types";

export interface ForumSectionOption {
  slug: ForumSectionSlug;
  title: string;
  description: string;
}

export const FORUM_SECTIONS: readonly ForumSectionOption[] = [
  {
    slug: "discussion",
    title: "Обсуждение",
    description: "Вопросы, опыт и обмен мнениями по перевозкам сельхозпродукции.",
  },
  {
    slug: "platform-issues",
    title: "Проблемы с платформой",
    description: "Ошибки, сбои и неполадки в работе сервиса — собираем и готовим к исправлению.",
  },
  {
    slug: "proposals",
    title: "Предложения по развитию",
    description: "Идеи и пожелания по улучшению AgroRunok — от новых фильтров до автоматизации.",
  },
  {
    slug: "support",
    title: "Поддержка",
    description: "Помощь по регистрации, созданию заявок, оплате и документам.",
  },
] as const;

export const FORUM_SECTION_SLUGS: readonly ForumSectionSlug[] = FORUM_SECTIONS.map(
  (section) => section.slug,
);

export function isForumSectionSlug(value: unknown): value is ForumSectionSlug {
  return typeof value === "string" && FORUM_SECTIONS.some((section) => section.slug === value);
}

export function getForumSection(slug: string): ForumSectionOption | undefined {
  return FORUM_SECTIONS.find((section) => section.slug === slug);
}
