import Link from "next/link";
import { getCurrentUser } from "@/server/modules/auth";
import { BrandIcon } from "@/shared/ui/BrandIcon";
import { CreateRequestButton } from "./CreateRequestButton";

interface HeaderProps {
  activePath?: string;
  fullWidth?: boolean;
}

const BTN_OUTLINE =
  "inline-flex items-center justify-center h-9 px-4 gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface text-sm font-normal text-text-secondary tracking-[-0.14px] leading-[1.43] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-outline-hover";

export async function Header({ activePath, fullWidth = false }: HeaderProps) {
  const user = await getCurrentUser();

  const navItems = [
    { href: "/search?type=load", label: "Поиск грузов" },
    { href: "/search?type=transport", label: "Найти перевозчика" },
    // { href: "#", label: "Грузы" },
    // { href: "#", label: "Перевозчики" },
    { href: "/forum", label: "Сообщество" },
  ] as const;

  return (
    <header className="py-2.5 border-b border-border">
      <div
        className={`${fullWidth ? "w-full px-6 max-md:px-4" : "container-app"} flex items-center justify-between gap-6 max-md:flex-wrap`}
      >
        <div className="flex items-center gap-10 max-md:flex-col max-md:items-start max-md:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-[-0.18px] text-text-primary"
          >
            <BrandIcon />
            AgroRunok
          </Link>
          <nav className="flex items-center gap-7 max-md:flex-wrap max-md:gap-4" aria-label="Основная навигация">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  activePath === item.href
                    ? "text-sm font-medium leading-[1.43] tracking-[-0.14px] text-text-primary"
                    : "text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary hover:text-text-primary"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 max-md:ml-auto">
          {user ? (
            <Link href="/profile" className={BTN_OUTLINE}>
              Профиль
            </Link>
          ) : (
            <Link href="/login" className={BTN_OUTLINE}>
              Войти
            </Link>
          )}
          <CreateRequestButton />
        </div>
      </div>
    </header>
  );
}
