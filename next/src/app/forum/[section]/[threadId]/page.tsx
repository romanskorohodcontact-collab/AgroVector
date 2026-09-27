import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { isForumSectionSlug } from "@/entities/forum/model";
import { ForumTopicScreen } from "@/screens/forum/ForumTopicScreen";

interface Props {
  params: Promise<{ section: string; threadId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ForumTopicPage({ params, searchParams }: Props) {
  const { section, threadId } = await params;
  if (!isForumSectionSlug(section) || !Types.ObjectId.isValid(threadId)) {
    notFound();
  }
  const { page } = await searchParams;
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);
  return (
    <ForumTopicScreen section={section} threadId={threadId} page={pageNumber} />
  );
}
