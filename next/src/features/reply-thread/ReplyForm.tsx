"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface ReplyFormProps {
  threadId: string;
}

export function ReplyForm({ threadId }: ReplyFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/forum/threads/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Не удалось отправить ответ");
      }
      return response.json();
    },
    onSuccess: () => {
      setText("");
      setFormError(null);
      router.refresh();
    },
    onError: (error: Error) => setFormError(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      setFormError("Введите текст ответа");
      return;
    }
    mutation.mutate();
  }

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <label
        className="mb-1.5 block text-[12px] font-medium tracking-[-0.12px] text-text-muted"
        htmlFor="forum-reply"
      >
        Написать ответ
      </label>
      <textarea
        id="forum-reply"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        maxLength={5000}
        placeholder="Текст ответа..."
        className="w-full resize-none rounded-2xl border border-outline-input px-4 py-3.5 text-base leading-[1.5] tracking-[-0.16px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
      />
      {formError && <p className="mt-2 text-sm tracking-[-0.14px] text-danger">{formError}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex h-9 items-center justify-center rounded-pill bg-accent px-4 text-sm font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Отправка..." : "Ответить"}
        </button>
        <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
          Тема открыта для ответов
        </span>
      </div>
    </form>
  );
}
