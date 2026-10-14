import type { ForumSearchType } from "@/entities/forum/model";
import { ForumSearchScreen } from "@/screens/forum/ForumSearchScreen";

interface Props {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

export default async function ForumSearchPage({ searchParams }: Props) {
  const { q, type, page } = await searchParams;
  const query = (q ?? "").trim();
  const searchType: ForumSearchType = type === "threads" || type === "sections" ? type : "all";
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);
  return <ForumSearchScreen query={query} type={searchType} page={pageNumber} />;
}
