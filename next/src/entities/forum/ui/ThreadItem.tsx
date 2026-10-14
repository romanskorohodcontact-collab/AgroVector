import Link from "next/link";
import { Tag } from "@/shared/ui/Tag";

export interface ThreadMark {
  label: string;
  variant?: "accent";
}

export interface ThreadItemProps {
  href: string;
  title: string;
  author?: string;
  date?: string;
  tags?: string[];
  answers?: number;
  views?: number;
  mark?: ThreadMark;
}

export function ThreadItem({
  href,
  title,
  author,
  date,
  tags,
  answers,
  views,
  mark,
}: ThreadItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-6 border-b border-divider px-2 py-4 hover:bg-bg-subtle"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {mark && (
            <span
              className={`inline-flex h-5 items-center rounded-pill px-2 text-[12px] leading-none tracking-[-0.16px] whitespace-nowrap ${
                mark.variant === "accent"
                  ? "bg-accent/10 text-accent"
                  : "bg-bg-subtle text-text-muted"
              }`}
            >
              {mark.label}
            </span>
          )}
          <h3 className="text-base leading-[1.38] font-medium tracking-[-0.16px] text-text-primary">
            {title}
          </h3>
        </div>
        {author && (
          <p className="text-sm leading-[1.43] tracking-[-0.14px] text-text-muted">
            <b className="font-medium text-text-primary">{author}</b>
            {date ? <> · {date}</> : null}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        )}
      </div>
      {(answers !== undefined || views !== undefined) && (
        <div className="flex flex-none items-center gap-5 max-md:flex-row">
          {answers !== undefined && (
            <div className="flex flex-col items-end gap-0.5 text-[12px] tracking-[-0.12px] text-text-muted">
              <b className="text-base font-medium tracking-[-0.16px] text-text-primary tabular-nums">
                {answers}
              </b>
              ответов
            </div>
          )}
          {views !== undefined && (
            <div className="flex flex-col items-end gap-0.5 text-[12px] tracking-[-0.12px] text-text-muted">
              <b className="text-base font-medium tracking-[-0.16px] text-text-primary tabular-nums">
                {views}
              </b>
              просмотров
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
