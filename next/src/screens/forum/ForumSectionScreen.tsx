import { formatRepliesLabel, formatThreadsLabel } from "@/entities/forum/model";
import { ForumSectionResults } from "@/features/forum-search/ForumSectionResults";
import { getSectionIndex } from "@/server/modules/forum";

interface ForumSectionScreenProps {
  section: string;
  query?: string;
  page?: number;
}

export async function ForumSectionScreen({
  section,
  query = "",
  page = 1,
}: ForumSectionScreenProps) {
  const data = await getSectionIndex(section);
  if (!data) return null;

  const { section: meta, threads } = data;

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-[26px] leading-[1.5] font-medium tracking-[-0.52px] text-text-primary">
          {meta.title}
        </h1>
        <p className="mt-2 text-lg leading-[1.78] tracking-[-0.18px] text-text-secondary">
          {meta.description}{" "}
          <span className="text-text-muted">
            {meta.threadsCount} {formatThreadsLabel(meta.threadsCount)} · {meta.postsCount}{" "}
            {formatRepliesLabel(meta.postsCount)}.
          </span>
        </p>
      </div>

      <ForumSectionResults
        threads={threads}
        sectionSlug={meta.slug}
        initialQuery={query}
        initialPage={page}
      />
    </div>
  );
}
