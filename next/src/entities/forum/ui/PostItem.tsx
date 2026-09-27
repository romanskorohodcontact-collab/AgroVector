import type { ReactNode } from "react";
import { Avatar } from "@/shared/ui/Avatar";

export interface PostItemProps {
  author: string;
  initials: string;
  date: string;
  text: string;
  isFirst?: boolean;
  actions?: ReactNode;
}

export function PostItem({
  author,
  initials,
  date,
  text,
  isFirst,
  actions,
}: PostItemProps) {
  return (
    <article
      className={`flex gap-5 py-6 px-2 border-b border-divider max-md:flex-col ${
        isFirst ? "bg-bg-subtle rounded-2xl px-4 mt-6 border-none" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-2 flex-none w-24 text-center max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-3 max-md:w-auto max-md:text-left">
        <Avatar
          initials={initials}
          variant={isFirst ? "surface" : "default"}
        />
        <span className="text-sm font-medium leading-[1.43] tracking-[-0.14px] text-text-primary">
          {author}
        </span>
        <span className="text-[12px] leading-[1.5] text-text-muted">{date}</span>
      </div>
      <div className="flex flex-col gap-3 min-w-0">
        <p className="text-base leading-[1.75] tracking-[-0.16px] text-text-primary whitespace-pre-line">
          {text}
        </p>
        {actions && <div className="flex gap-4">{actions}</div>}
      </div>
    </article>
  );
}
