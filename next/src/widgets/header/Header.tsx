import Link from "next/link";
import { getCurrentUser } from "@/server/modules/auth";
import { BrandIcon } from "@/shared/ui/BrandIcon";
import { CreateRequestButton } from "./CreateRequestButton";

interface HeaderProps {
  activePath?: string;
  fullWidth?: boolean;
}

const NAV_LINK =
  "text-[20px] font-normal leading-none tracking-[-0.2px] text-text-inverse transition-opacity duration-150 hover:opacity-80 max-md:text-sm max-md:leading-[1.43]";
const NAV_LINK_ACTIVE = `${NAV_LINK} font-medium`;

export async function Header({ activePath, fullWidth = false }: HeaderProps) {
  const user = await getCurrentUser();

  const navItems = [
    { href: "/search?type=transport", label: "Перевозчики" },
    { href: "/search?type=load", label: "Грузы" },
    { href: "/forum", label: "Сообщество" },
  ] as const;

  return (
    <header className="bg-[linear-gradient(90deg,var(--color-header-from)_0%,var(--color-header-to)_100%)]">
      <div
        className={`${fullWidth ? "w-full px-12 max-md:px-4" : "container-app"} flex h-[85px] items-center justify-between gap-6 max-md:h-auto max-md:flex-wrap max-md:py-3`}
      >
        <div className="flex items-center gap-12 max-md:flex-col max-md:items-start max-md:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[28px] leading-none font-semibold tracking-[-0.28px] text-text-inverse max-md:text-xl"
          >
            {/*<BrandIcon className="h-7 w-7 text-text-inverse max-md:h-6 max-md:w-6" />*/}
            АгроВектор
          </Link>
          <nav
            className="flex items-center gap-6 max-md:flex-wrap max-md:gap-4"
            aria-label="Основная навигация"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={activePath === item.href ? NAV_LINK_ACTIVE : NAV_LINK}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6 max-md:ml-auto max-md:gap-4">
          {user ? (
            <Link
              href="/profile"
              className={activePath === "/profile" ? NAV_LINK_ACTIVE : NAV_LINK}
            >
              Профиль
            </Link>
          ) : (
            <Link href="/login" className={NAV_LINK}>
              Войти
            </Link>
          )}
          <CreateRequestButton />
        </div>
      </div>
    </header>
  );
}
