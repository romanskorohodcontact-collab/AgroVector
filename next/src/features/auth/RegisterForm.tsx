"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon } from "@/shared/ui/EyeIcon";
import { FormInput, FormInputIcon } from "@/shared/ui/FormInput";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: async (payload: { phone: string; password: string; passwordConfirm: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? "Не удалось зарегистрироваться");
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
      phone: String(form.get("phone") ?? ""),
      password: String(form.get("password") ?? ""),
      passwordConfirm: String(form.get("passwordConfirm") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor="register-phone"
          className="text-sm font-medium tracking-[-0.14px] text-text-primary"
        >
          Номер телефона
        </label>
        <FormInput
          id="register-phone"
          name="phone"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          autoComplete="tel"
          required
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor="register-password"
          className="text-sm font-medium tracking-[-0.14px] text-text-primary"
        >
          Пароль
        </label>
        <FormInputIcon
          id="register-password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Введите пароль"
          autoComplete="new-password"
          required
          icon={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              className="flex cursor-pointer border-0 bg-transparent p-1 text-icon-subtle transition-colors duration-150 hover:text-icon"
            >
              <EyeIcon />
            </button>
          }
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor="register-password-confirm"
          className="text-sm font-medium tracking-[-0.14px] text-text-primary"
        >
          Повторите пароль
        </label>
        <FormInputIcon
          id="register-password-confirm"
          name="passwordConfirm"
          type={showPasswordConfirm ? "text" : "password"}
          placeholder="Введите пароль ещё раз"
          autoComplete="new-password"
          required
          icon={
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((value) => !value)}
              aria-label={showPasswordConfirm ? "Скрыть пароль" : "Показать пароль"}
              className="flex cursor-pointer border-0 bg-transparent p-1 text-icon-subtle transition-colors duration-150 hover:text-icon"
            >
              <EyeIcon />
            </button>
          }
        />
      </div>

      {error ? <p className="text-sm leading-[1.43] text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-2 flex h-12 items-center justify-center gap-[6px] rounded-pill bg-accent px-[21.28px] text-base leading-none font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:bg-accent-active disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-inverse/80"
      >
        {mutation.isPending ? "Регистрация…" : "Зарегистрироваться"}
      </button>
    </form>
  );
}
