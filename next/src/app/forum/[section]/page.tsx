import { ForumSectionScreen } from "@/screens/forum/ForumSectionScreen";
import { isForumSectionSlug } from "@/entities/forum/model";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ForumSectionPage({ params, searchParams }: Props) {
  const { section } = await params;
  if (!isForumSectionSlug(section)) {
    notFound();
  }
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);
  return <ForumSectionScreen section={section} query={query} page={pageNumber} />;
}
