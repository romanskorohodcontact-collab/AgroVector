import type { ForumSearchType } from "@/entities/forum/model";
import { ForumSearchResults } from "@/features/forum-search/ForumSearchResults";
import { getSearchIndex } from "@/server/modules/forum";

interface ForumSearchScreenProps {
  query: string;
  type: ForumSearchType;
  page: number;
}

export async function ForumSearchScreen({
  query,
  type,
  page,
}: ForumSearchScreenProps) {
  const index = await getSearchIndex();

  return (
    <ForumSearchResults
      sections={index.sections}
      threads={index.threads}
      initialQuery={query}
      initialType={type}
      initialPage={page}
    />
  );
}
