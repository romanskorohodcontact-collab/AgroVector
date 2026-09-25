import Link from "next/link";

const FOOTER_COLUMNS: { title: string; aria: string; links: string[] }[] = [
  {
    title: "Продукт",
    aria: "Продукт",
    links: ["#", "#", "#"],
  },
  {
    title: "Перевозчикам",
    aria: "Перевозчикам",
    links: ["/search?type=load", "/transports/create", "#"],
  },
  {
    title: "Грузоотправителям",
    aria: "Грузоотправителям",
    links: ["/loads/create", "/search?type=load", "#"],
  },
  {
    title: "Компания",
    aria: "Компания",
    links: ["#", "#", "/forum"],
  },
];

const FOOTER_LABELS: string[][] = [
  ["Возможности", "Тарифы", "Приложение"],
  ["Найти груз", "Добавить транспорт", "Страхование"],
  ["Выложить заявку", "Отслеживание", "Документы"],
  ["О нас", "Контакты", "Поддержка"],
];



export function Footer() {
  return (
    <footer className="bg-bg-subtle border-t border-border py-16 pb-10 max-md:py-12 max-md:pb-8">
      <div className="container-app">
        <div className="grid grid-cols-[2fr_repeat(4,1fr)] gap-12 max-lg:grid-cols-2 max-lg:gap-10 max-md:grid-cols-1 max-md:gap-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold leading-[1.3] tracking-[-0.18px] text-text-primary"
            >
              <FooterBrandIcon />
              AgroRunok
            </Link>
            <p className="mt-4 max-w-[260px] text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
              Площадка для поиска перевозок и транспорта для аграрного рынка.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column, index) => (
            <nav key={column.title} aria-label={column.aria}>
              <h3 className="mb-5 text-sm font-semibold leading-[1.43] text-text-primary tracking-[-0.14px]">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {column.links.map((href, linkIndex) => {
                  const label = FOOTER_LABELS[index][linkIndex];
                  return (
                    <li key={label}>
                      {href === "#" ? (
                        <a
                          href={href}
                          className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px] hover:text-text-primary"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px] hover:text-text-primary">
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex justify-between gap-4 flex-wrap mt-12 pt-6 border-t border-border">
          <span className="text-xs leading-[1.5] whitespace-nowrap text-text-muted">
            © 2026 AgroRunok.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterBrandIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-6 w-6 text-accent"
    >
      <rect x="3" y="9" width="16" height="16" rx="4" fill="currentColor"></rect>
      <path
        d="M24 10h3l.6 1.9L29 15v8l-1.6 1.2L29 24h-5l-1-1.2V15l1-.9.8-2.1L24 10Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}