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
    <nav className="flex items-center gap-2 flex-wrap" aria-label="Хлебные крошки">
      {items.map((item) => (
        <Fragment key={item.href}>
          <Link
            href={item.href}
            className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary hover:text-text-primary"
          >
            {item.label}
          </Link>
          <span className="text-sm text-text-muted" aria-hidden="true">/</span>
        </Fragment>
      ))}
      <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
        {current}
      </span>
    </nav>
  );
}
