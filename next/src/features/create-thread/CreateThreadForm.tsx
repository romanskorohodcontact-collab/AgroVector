"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import {
  FORUM_SECTIONS,
  type ForumSectionSlug,
  type ForumThread,
} from "@/entities/forum/model";

interface CreateThreadFormProps {
  initialSection?: ForumSectionSlug;
}

const FIELD_LABEL =
  "block mb-1.5 text-[12px] font-medium tracking-[-0.12px] text-text-muted";
const INPUT =
  "h-[58px] border border-outline-input rounded-pill px-4 w-full outline-none text-base leading-[1.5] tracking-[-0.16px] text-text-primary placeholder:text-text-muted bg-bg-surface focus:border-accent";

export function CreateThreadForm({ initialSection }: CreateThreadFormProps) {
  const router = useRouter();
  const [section, setSection] = useState<ForumSectionSlug>(
    initialSection ?? "discussion"
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, title, body, tags }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Не удалось создать тему");
      }
      return (await response.json()) as ForumThread;
    },
    onSuccess: (thread) => {
      router.push(`/forum/${thread.section}/${thread.id}`);
    },
    onError: (error: Error) => setFormError(error.message),
  });

  function addTag() {
    const tag = tagInput.trim().slice(0, 30);
    if (!tag || tags.length >= 5) {
      setTagInput("");
      return;
    }
    if (!tags.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Заголовок обязателен");
      return;
    }
    if (!body.trim()) {
      setFormError("Текст обязателен");
      return;
    }
    mutation.mutate();
  }

  return (
    <form className="max-w-[620px]" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className={FIELD_LABEL} htmlFor="f-topic-section">
          Раздел
        </label>
        <div className="relative">
          <select
            id="f-topic-section"
            value={section}
            onChange={(event) =>
              setSection(event.target.value as ForumSectionSlug)
            }
            className="h-[58px] w-full appearance-none border border-outline-input rounded-pill px-4 pr-10 bg-bg-surface text-base leading-[1.5] tracking-[-0.16px] text-text-secondary outline-none focus:border-accent cursor-pointer"
          >
            {FORUM_SECTIONS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </div>
      </div>

      <div className="mb-5">
        <label className={FIELD_LABEL} htmlFor="f-topic-title">
          Заголовок
        </label>
        <input
          id="f-topic-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Краткий заголовок темы"
          maxLength={200}
          className={INPUT}
          autoComplete="off"
        />
      </div>

      <div className="mb-5">
        <label className={FIELD_LABEL} htmlFor="f-topic-body">
          Текст
        </label>
        <textarea
          id="f-topic-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Подробно опишите вопрос или предложение..."
          className="w-full border border-outline-input rounded-2xl px-4 py-3.5 resize-none outline-none text-base leading-[1.5] tracking-[-0.16px] text-text-primary placeholder:text-text-muted bg-bg-surface focus:border-accent"
        />
      </div>

      <div className="mb-5">
        <span className={FIELD_LABEL}>Теги</span>
        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-pill bg-bg-subtle text-[13px] tracking-[-0.13px] text-text-secondary whitespace-nowrap"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setTags((prev) => prev.filter((item) => item !== tag))
                }
                className="flex cursor-pointer text-text-muted hover:text-text-primary"
                aria-label={`Удалить тег ${tag}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-3 h-3"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder="Добавить тег"
            disabled={tags.length >= 5}
            className="inline-flex h-7 w-[130px] px-3 rounded-pill bg-bg-surface border-[1.2px] border-dashed border-outline text-[13px] tracking-[-0.13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent disabled:opacity-60"
          />
        </div>
      </div>

      {formError && (
        <p className="mb-4 text-sm tracking-[-0.14px] text-danger">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-3 mt-7">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center h-12 px-[21px] rounded-pill bg-accent text-base font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Публикация..." : "Создать тему"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/forum")}
          className="inline-flex items-center justify-center h-9 px-4 rounded-pill bg-bg-subtle text-sm font-medium text-text-primary tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
