import Link from "next/link";
import { RegisterForm } from "@/features/auth";
import { Header } from "@/widgets/header";

export function RegisterScreen() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 pt-12 pb-20 max-[560px]:px-4 max-[560px]:pt-8 max-[560px]:pb-[60px]">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-center text-[30px] leading-[1.4] font-semibold tracking-[-0.6px] text-text-dark max-[560px]:text-[26px]">
              Создание аккаунта
            </h1>
            <p className="text-center text-lg leading-[1.78] font-normal tracking-[-0.18px] text-text-secondary">
              Введите данные для регистрации
            </p>
          </div>

          <RegisterForm />

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-outline" />
            <span className="text-sm font-normal tracking-[-0.14px] whitespace-nowrap text-text-muted">
              или
            </span>
            <span className="h-px flex-1 bg-outline" />
          </div>

          <p className="text-center text-sm leading-[1.43] font-normal tracking-[-0.14px] text-text-secondary">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
            >
              Войти
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
