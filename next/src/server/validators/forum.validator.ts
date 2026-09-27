import { isForumSectionSlug, type ForumSectionSlug } from "@/entities/forum/model";

export interface ForumThreadInput {
  section: ForumSectionSlug;
  title: string;
  body: string;
  tags: string[];
}

export interface ForumPostInput {
  text: string;
}

const MAX_TITLE = 200;
const MAX_BODY = 5000;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;

export function validateThreadInput(raw: unknown): ForumThreadInput {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные формы");
  }
  if (!isForumSectionSlug(raw.section)) {
    throw new Error("Раздел не выбран");
  }
  const title = limitedString(raw.title, "Заголовок", MAX_TITLE);
  const body = limitedString(raw.body, "Текст", MAX_BODY);
  const tags = parseTags(raw.tags);
  return { section: raw.section, title, body, tags };
}

export function validatePostInput(raw: unknown): ForumPostInput {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные формы");
  }
  const text = limitedString(raw.text, "Текст ответа", MAX_BODY);
  return { text };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function limitedString(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} обязательно`);
  }
  const result = value.trim();
  if (result.length > max) {
    throw new Error(`${field} не должен превышать ${max} символов`);
  }
  return result;
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const tag = item.trim().slice(0, MAX_TAG_LENGTH);
    if (!tag || seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}
