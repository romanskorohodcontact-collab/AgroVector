import Link from "next/link";

interface PagerProps {
  page: number;
  pageCount: number;
  hrefFor?: (page: number) => string;
  onSelect?: (page: number) => void;
}

export function Pager({ page, pageCount, hrefFor, onSelect }: PagerProps) {
  const base =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-pill text-sm text-text-secondary";
  const idle = `${base} bg-bg-surface border-[0.8px] border-outline hover:border-outline-hover hover:text-text-primary`;
  const active = `${base} bg-accent border-[0.8px] border-accent text-text-inverse`;

  function control(target: number, label: string, isActive = false) {
    const className = isActive ? active : idle;
    if (onSelect) {
      return (
        <button
          type="button"
          onClick={() => onSelect(target)}
          aria-current={isActive ? "page" : undefined}
          className={className}
        >
          {label}
        </button>
      );
    }
    return (
      <Link href={hrefFor!(target)} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-6">
      {page > 1 && control(page - 1, "Назад")}
      {pageNumbers(page, pageCount).map((item, index) =>
        item === "..." ? (
          <span key={`e-${index}`} className="text-text-muted text-sm">
            …
          </span>
        ) : (
          <span key={item}>
            {control(item, String(item), item === page)}
          </span>
        )
      )}
      {page < pageCount && control(page + 1, "Вперёд")}
    </div>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result: (number | "...")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}
