"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@/entities/user/model";
import { getInitials } from "@/shared/lib/getInitials";
import { FormInput } from "@/shared/ui/FormInput";

const fieldLabelClass = "text-sm font-medium text-text-primary tracking-[-0.14px]";

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? "Не удалось сохранить профиль");
      }
      return data;
    },
    onSuccess: () => {
      router.push("/profile");
      router.refresh();
    },
  });

  const error = mutation.isError ? mutation.error.message : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      name: String(form.get("name") ?? ""),
      companyName: String(form.get("companyName") ?? ""),
      email: String(form.get("email") ?? ""),
    });
  }

  return (
    <div className="mx-auto mt-8 mb-14 w-full max-w-[720px] rounded-[20px] border border-border bg-bg-surface p-9 max-[640px]:mx-4 max-[640px]:mt-6 max-[640px]:mb-10 max-[640px]:px-4 max-[640px]:py-6">
      <div className="mb-7 flex items-center gap-4 border-b border-border pb-7 max-[640px]:mb-5 max-[640px]:gap-3 max-[640px]:pb-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent),color-mix(in_srgb,var(--color-accent)_70%,#fff))] text-[22px] font-medium tracking-[-0.5px] text-text-inverse max-[640px]:h-12 max-[640px]:w-12 max-[640px]:text-[19px]">
          {getInitials(user.name)}
        </div>
        <div>
          <div className="text-lg font-medium tracking-[-0.18px] text-text-primary">
            {user.name || "—"}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <span className="text-sm tracking-[-0.14px] text-text-secondary">
              {user.companyName || "—"}
            </span>
            <span className="inline-flex h-6 items-center rounded-pill bg-bg-subtle px-3 text-[13px] font-medium tracking-[-0.13px] whitespace-nowrap text-accent">
              <span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              Перевозчик
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[640px]:grid-cols-1 max-[640px]:gap-y-4">
          <div className="flex min-w-0 flex-col gap-[6px]">
            <label className={fieldLabelClass} htmlFor="field-name">
              Имя
            </label>
            <FormInput
              id="field-name"
              name="name"
              type="text"
              defaultValue={user.name ?? ""}
              placeholder="Введите имя"
              autoComplete="name"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-[6px]">
            <label className={fieldLabelClass} htmlFor="field-company">
              Название компании
            </label>
            <FormInput
              id="field-company"
              name="companyName"
              type="text"
              defaultValue={user.companyName ?? ""}
              placeholder="Введите название компании"
              autoComplete="organization"
            />
          </div>
          <div className="col-span-2 flex min-w-0 flex-col gap-[6px] max-[640px]:col-span-1">
            <label className={fieldLabelClass} htmlFor="field-email">
              Электронная почта
            </label>
            <FormInput
              id="field-email"
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              placeholder="example@email.ru"
              autoComplete="email"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-6 text-center text-sm tracking-[-0.14px] text-danger max-[640px]:mt-5">
            {error}
          </p>
        ) : null}

        <div className="mt-7 flex justify-end gap-3 border-t border-border pt-6 max-[640px]:flex-col-reverse max-[640px]:gap-2.5">
          <Link
            href="/profile"
            role="button"
            title="Отмена"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-pill bg-bg-subtle px-[21.28px] text-base font-medium tracking-[-0.16px] whitespace-nowrap text-text-primary transition-colors duration-150 hover:bg-bg-hover max-[640px]:w-full"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-pill bg-accent px-[21.28px] text-base font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 max-[640px]:w-full"
          >
            {mutation.isPending ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
