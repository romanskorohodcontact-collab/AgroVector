import type { ForumThreadSummary } from "@/entities/forum/model";

export async function fetchForumThreadSummaries(): Promise<ForumThreadSummary[]> {
  const response = await fetch("/api/forum/threads/summaries");
  if (!response.ok) {
    throw new Error("Не удалось получить темы");
  }
  return response.json();
}
