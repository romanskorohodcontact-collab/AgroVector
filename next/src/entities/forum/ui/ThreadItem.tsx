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
      className="flex items-center justify-between gap-6 py-4 px-2 border-b border-divider hover:bg-bg-subtle"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          {mark && (
            <span
              className={`inline-flex items-center h-5 px-2 rounded-pill text-[12px] leading-none tracking-[-0.16px] whitespace-nowrap ${
                mark.variant === "accent"
                  ? "bg-accent/10 text-accent"
                  : "bg-bg-subtle text-text-muted"
              }`}
            >
              {mark.label}
            </span>
          )}
          <h3 className="text-base font-medium leading-[1.38] tracking-[-0.16px] text-text-primary">
            {title}
          </h3>
        </div>
        {author && (
          <p className="text-sm leading-[1.43] tracking-[-0.14px] text-text-muted">
            <b className="text-text-primary font-medium">{author}</b>
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
        <div className="flex items-center gap-5 flex-none max-md:flex-row">
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
