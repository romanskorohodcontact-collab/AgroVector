import { Fragment } from "react";
import Link from "next/link";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  current: string;
}

export function Breadcrumbs({ items, current }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Хлебные крошки">
      {items.map((item) => (
        <Fragment key={item.href}>
          <Link
            href={item.href}
            className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary hover:text-text-primary"
          >
            {item.label}
          </Link>
          <span className="text-sm text-text-muted" aria-hidden="true">
            /
          </span>
        </Fragment>
      ))}
      <span className="overflow-hidden text-sm leading-[1.43] tracking-[-0.14px] text-ellipsis whitespace-nowrap text-text-primary">
        {current}
      </span>
    </nav>
  );
}
