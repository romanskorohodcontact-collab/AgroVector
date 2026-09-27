import { formatForumDate, type ForumThread } from "../model";
import type { ThreadItemProps, ThreadMark } from "./ThreadItem";

export function toThreadItemProps(thread: ForumThread): ThreadItemProps {
  const mark: ThreadMark | undefined = thread.isPinned
    ? { label: "Закреплена", variant: "accent" }
    : thread.isClosed
      ? { label: "Закрыта" }
      : undefined;
  return {
    href: `/forum/${thread.section}/${thread.id}`,
    title: thread.title,
    author: thread.author.name,
    date: formatForumDate(thread.createdAt),
    tags: thread.tags,
    answers: thread.repliesCount,
    views: thread.viewsCount,
    mark,
  };
}
