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

export function PostItem({ author, initials, date, text, isFirst, actions }: PostItemProps) {
  return (
    <article
      className={`flex gap-5 border-b border-divider px-2 py-6 max-md:flex-col ${
        isFirst ? "mt-6 rounded-2xl border-none bg-bg-subtle px-4" : ""
      }`}
    >
      <div className="flex w-24 flex-none flex-col items-center gap-2 text-center max-md:w-auto max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-3 max-md:text-left">
        <Avatar initials={initials} variant={isFirst ? "surface" : "default"} />
        <span className="text-sm leading-[1.43] font-medium tracking-[-0.14px] text-text-primary">
          {author}
        </span>
        <span className="text-[12px] leading-[1.5] text-text-muted">{date}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-base leading-[1.75] tracking-[-0.16px] whitespace-pre-line text-text-primary">
          {text}
        </p>
        {actions && <div className="flex gap-4">{actions}</div>}
      </div>
    </article>
  );
}
