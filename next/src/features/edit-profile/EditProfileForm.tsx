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
    <div className="w-full max-w-[720px] mx-auto mt-8 mb-14 p-9 bg-white border border-[#ECECEC] rounded-[20px] max-[640px]:mt-6 max-[640px]:mx-4 max-[640px]:mb-10 max-[640px]:py-6 max-[640px]:px-4">
      <div className="flex items-center gap-4 pb-7 mb-7 border-b border-[#ECECEC] max-[640px]:gap-3 max-[640px]:pb-5 max-[640px]:mb-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[linear-gradient(135deg,#23793D,#2d994d)] text-[22px] font-medium text-white tracking-[-0.5px] shrink-0 max-[640px]:w-12 max-[640px]:h-12 max-[640px]:text-[19px]">
          {getInitials(user.name)}
        </div>
        <div>
          <div className="text-lg font-medium text-text-primary tracking-[-0.18px]">
            {user.name || "—"}
          </div>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <span className="text-sm text-text-secondary tracking-[-0.14px]">
              {user.companyName || "—"}
            </span>
            <span className="inline-flex items-center h-6 px-3 rounded-pill bg-bg-subtle text-[13px] font-medium text-accent tracking-[-0.13px] whitespace-nowrap">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-accent mr-2"
              ></span>
              Перевозчик
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[640px]:grid-cols-1 max-[640px]:gap-y-4">
          <div className="flex flex-col gap-[6px] min-w-0">
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
          <div className="flex flex-col gap-[6px] min-w-0">
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
          <div className="flex flex-col gap-[6px] min-w-0 col-span-2 max-[640px]:col-span-1">
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
          <p className="text-sm text-center text-red-600 tracking-[-0.14px] mt-6 max-[640px]:mt-5">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-3 mt-7 pt-6 border-t border-[#ECECEC] max-[640px]:flex-col-reverse max-[640px]:gap-2.5">
          <Link
            href="/profile"
            role="button"
            title="Отмена"
            className="inline-flex items-center justify-center h-12 min-w-[160px] px-[21.28px] rounded-pill bg-bg-subtle text-base font-medium text-text-primary tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-[#E5E5E5] max-[640px]:w-full"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center h-12 min-w-[160px] px-[21.28px] rounded-pill bg-accent text-base font-medium text-white tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-[#1E6834] disabled:opacity-60 disabled:cursor-not-allowed max-[640px]:w-full"
          >
            {mutation.isPending ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}