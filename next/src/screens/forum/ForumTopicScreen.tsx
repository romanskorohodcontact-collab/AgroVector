import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import {
  formatForumDate,
  formatForumDateTime,
} from "@/entities/forum/model";
import { PostItem } from "@/entities/forum/ui";
import { ReplyForm } from "@/features/reply-thread/ReplyForm";
import { Pager } from "@/shared/ui/Pager";
import { Tag } from "@/shared/ui/Tag";
import { getThread, incrementThreadViews } from "@/server/modules/forum";

interface ForumTopicScreenProps {
  section: string;
  threadId: string;
  page?: number;
}

export async function ForumTopicScreen({
  section,
  threadId,
  page = 1,
}: ForumTopicScreenProps) {
  const thread = await getThread(threadId, page);
  if (!thread || thread.section !== section) {
    notFound();
  }

  after(() => incrementThreadViews(threadId));

  const replyActions = thread.isClosed ? (
    <div className="flex gap-4">
      <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
        Цитировать
      </span>
    </div>
  ) : (
    <div className="flex gap-4">
      <Link
        href="#forum-reply"
        className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary hover:text-text-primary"
      >
        Ответить
      </Link>
      <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
        Цитировать
      </span>
    </div>
  );

  return (
    <div className="flex flex-col">

      <div>
        {thread.isClosed && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center h-5 px-2 rounded-pill bg-bg-subtle text-[12px] leading-none tracking-[-0.16px] whitespace-nowrap text-text-muted">
              Закрыта
            </span>
          </div>
        )}
        <h1 className="mt-2.5 text-[26px] font-medium leading-[1.5] tracking-[-0.52px] text-text-primary">
          {thread.title}
        </h1>
        <p className="mt-2 text-lg leading-[1.78] tracking-[-0.18px] text-text-secondary">
          Начато{" "}
          <b className="text-text-primary font-medium">{thread.author.name}</b> ·{" "}
          {formatForumDate(thread.createdAt)}
        </p>
        {thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {thread.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="mt-6 border-t border-divider">
        <PostItem
          author={thread.author.name}
          initials={thread.author.initials}
          date={formatForumDateTime(thread.createdAt)}
          text={thread.body}
          isFirst
          actions={replyActions}
        />
        {thread.posts.map((post) => (
          <PostItem
            key={post.id}
            author={post.author.name}
            initials={post.author.initials}
            date={formatForumDateTime(post.createdAt)}
            text={post.text}
            actions={replyActions}
          />
        ))}
      </div>

      {thread.pageCount > 1 && (
        <Pager
          page={thread.page}
          pageCount={thread.pageCount}
          hrefFor={(target) => `/forum/${section}/${threadId}?page=${target}`}
        />
      )}

      {thread.isClosed ? (
        <div className="flex items-center gap-2.5 mt-6 p-3.5 px-4 rounded-2xl bg-bg-subtle">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none text-text-muted"
          >
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
            Тема закрыта модератором. Новые ответы недоступны.
          </span>
        </div>
      ) : (
        <ReplyForm threadId={thread.id} />
      )}
    </div>
  );
}
