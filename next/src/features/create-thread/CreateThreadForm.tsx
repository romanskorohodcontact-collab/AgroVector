"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { FORUM_SECTIONS, type ForumSectionSlug, type ForumThread } from "@/entities/forum/model";

interface CreateThreadFormProps {
  initialSection?: ForumSectionSlug;
}

const FIELD_LABEL = "block mb-1.5 text-[12px] font-medium tracking-[-0.12px] text-text-muted";
const INPUT =
  "h-[58px] border border-outline-input rounded-pill px-4 w-full outline-none text-base leading-[1.5] tracking-[-0.16px] text-text-primary placeholder:text-text-muted bg-bg-surface focus:border-accent";

export function CreateThreadForm({ initialSection }: CreateThreadFormProps) {
  const router = useRouter();
  const [section, setSection] = useState<ForumSectionSlug>(initialSection ?? "discussion");
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
            onChange={(event) => setSection(event.target.value as ForumSectionSlug)}
            className="h-[58px] w-full cursor-pointer appearance-none rounded-pill border border-outline-input bg-bg-surface px-4 pr-10 text-base leading-[1.5] tracking-[-0.16px] text-text-secondary outline-none focus:border-accent"
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
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-muted"
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
          className="w-full resize-none rounded-2xl border border-outline-input bg-bg-surface px-4 py-3.5 text-base leading-[1.5] tracking-[-0.16px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
        />
      </div>

      <div className="mb-5">
        <span className={FIELD_LABEL}>Теги</span>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-7 items-center gap-1.5 rounded-pill bg-bg-subtle px-3 text-[13px] tracking-[-0.13px] whitespace-nowrap text-text-secondary"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                className="flex cursor-pointer text-text-muted hover:text-text-primary"
                aria-label={`Удалить тег ${tag}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-3 w-3"
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
            className="inline-flex h-7 w-[130px] rounded-pill border-[1.2px] border-dashed border-outline bg-bg-surface px-3 text-[13px] tracking-[-0.13px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent disabled:opacity-60"
          />
        </div>
      </div>

      {formError && <p className="mb-4 text-sm tracking-[-0.14px] text-danger">{formError}</p>}

      <div className="mt-7 flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex h-12 items-center justify-center rounded-pill bg-accent px-[21px] text-base font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Публикация..." : "Создать тему"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/forum")}
          className="inline-flex h-9 items-center justify-center rounded-pill bg-bg-subtle px-4 text-sm font-medium tracking-[-0.16px] whitespace-nowrap text-text-primary transition-colors duration-150 hover:bg-bg-hover"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
