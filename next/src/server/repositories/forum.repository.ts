import { Types, type QueryFilter } from "mongoose";
import {
  toInitials,
  type ForumAuthor,
  type ForumPost,
  type ForumSectionSlug,
  type ForumThread,
  type ForumThreadSummary,
} from "@/entities/forum/model";
import { connectDb } from "@/server/db/connection";
import {
  ForumThreadModel,
  type ForumThreadFields,
} from "@/server/db/models/forum-thread";
import {
  ForumPostModel,
  type ForumPostFields,
} from "@/server/db/models/forum-post";

export interface CreateThreadData {
  section: ForumSectionSlug;
  title: string;
  body: string;
  authorId?: string | null;
  authorName: string;
  tags: string[];
}

export interface CreatePostData {
  threadId: string;
  authorId?: string | null;
  authorName: string;
  text: string;
}

interface ThreadRecord extends ForumThreadFields {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface PostRecord extends ForumPostFields {
  _id: Types.ObjectId;
  createdAt: Date;
}

export interface SectionStats {
  slug: ForumSectionSlug;
  threadsCount: number;
  postsCount: number;
}

export async function listSectionsWithStats(): Promise<SectionStats[]> {
  await connectDb();
  const rows = await ForumThreadModel.aggregate<{
    _id: ForumSectionSlug;
    threads: number;
    posts: number;
  }>([
    {
      $group: {
        _id: "$section",
        threads: { $sum: 1 },
        posts: { $sum: { $add: ["$repliesCount", 1] } },
      },
    },
  ]);
  return rows.map((row) => ({
    slug: row._id,
    threadsCount: row.threads,
    postsCount: row.posts,
  }));
}

export async function listLatestThreads(limit: number): Promise<ForumThread[]> {
  await connectDb();
  const docs = (await ForumThreadModel.find()
    .sort({ isPinned: -1, lastActivityAt: -1 })
    .limit(limit)
    .lean()) as unknown as ThreadRecord[];
  return docs.map(toThread);
}

export async function listAllThreads(
  filter: { section?: ForumSectionSlug } = {},
  page?: number,
  limit?: number
): Promise<{ items: ForumThread[]; total: number }> {
  await connectDb();
  const query: QueryFilter<ForumThreadFields> = filter.section
    ? { section: filter.section }
    : {};
  const isPaginated = page !== undefined && limit !== undefined;
  const [total, docs] = await Promise.all([
    ForumThreadModel.countDocuments(query),
    ForumThreadModel.find(query)
      .sort({ isPinned: -1, lastActivityAt: -1 })
      .skip(isPaginated ? (page - 1) * limit : 0)
      .limit(isPaginated ? limit : 0)
      .lean(),
  ]);
  return {
    items: (docs as unknown as ThreadRecord[]).map(toThread),
    total,
  };
}

export async function listThreadSummaries(): Promise<ForumThreadSummary[]> {
  await connectDb();
  const docs = (await ForumThreadModel.find()
    .select({ title: 1, section: 1, tags: 1 })
    .sort({ lastActivityAt: -1 })
    .lean()) as unknown as Pick<
    ThreadRecord,
    "_id" | "title" | "section" | "tags"
  >[];
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    section: doc.section,
    tags: doc.tags ?? [],
  }));
}

export async function getThreadById(id: string): Promise<ForumThread | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  await connectDb();
  const doc = await ForumThreadModel.findById(objectId).lean();
  return doc ? toThread(doc as unknown as ThreadRecord) : null;
}

export async function listPostsByThread(
  threadId: string,
  page: number,
  limit: number
): Promise<{ items: ForumPost[]; total: number }> {
  const objectId = toObjectId(threadId);
  if (!objectId) return { items: [], total: 0 };
  await connectDb();
  const query = { threadId: objectId };
  const [total, docs] = await Promise.all([
    ForumPostModel.countDocuments(query),
    ForumPostModel.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  return {
    items: (docs as unknown as PostRecord[]).map(toPost),
    total,
  };
}

export async function getThreadBody(id: string): Promise<string | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  await connectDb();
  const doc = await ForumThreadModel.findById(objectId)
    .select({ body: 1 })
    .lean();
  return doc ? (doc.body as string) : null;
}

export async function createThread(
  data: CreateThreadData
): Promise<ForumThread> {
  await connectDb();
  const now = new Date();
  const doc = await ForumThreadModel.create({
    section: data.section,
    title: data.title,
    body: data.body,
    authorId: data.authorId ? toObjectId(data.authorId) : null,
    authorName: data.authorName,
    tags: data.tags,
    isPinned: false,
    isClosed: false,
    viewsCount: 0,
    repliesCount: 0,
    lastActivityAt: now,
  });
  return toThread(doc.toObject() as unknown as ThreadRecord);
}

export async function createPost(data: CreatePostData): Promise<ForumPost> {
  await connectDb();
  const threadId = toObjectId(data.threadId);
  if (!threadId) throw new Error("Тема не найдена");
  const doc = await ForumPostModel.create({
    threadId,
    authorId: data.authorId ? toObjectId(data.authorId) : null,
    authorName: data.authorName,
    text: data.text,
  });
  await ForumThreadModel.updateOne(
    { _id: threadId },
    { $inc: { repliesCount: 1 }, $set: { lastActivityAt: new Date() } }
  );
  return toPost(doc.toObject() as unknown as PostRecord);
}

export async function threadExists(id: string): Promise<boolean> {
  const objectId = toObjectId(id);
  if (!objectId) return false;
  await connectDb();
  return (await ForumThreadModel.exists({ _id: objectId })) != null;
}

export async function incrementThreadViews(id: string): Promise<void> {
  const objectId = toObjectId(id);
  if (!objectId) return;
  await connectDb();
  await ForumThreadModel.updateOne(
    { _id: objectId },
    { $inc: { viewsCount: 1 } }
  );
}

export async function searchThreads(
  query: string,
  page: number,
  limit: number
): Promise<{ items: ForumThread[]; total: number }> {
  await connectDb();
  if (!query) return { items: [], total: 0 };
  const filter: QueryFilter<ForumThreadFields> = {
    $or: [
      { title: { $regex: escapeRegex(query), $options: "i" } },
      { tags: { $regex: escapeRegex(query), $options: "i" } },
    ],
  };
  const [total, docs] = await Promise.all([
    ForumThreadModel.countDocuments(filter),
    ForumThreadModel.find(filter)
      .sort({ isPinned: -1, lastActivityAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  return {
    items: (docs as unknown as ThreadRecord[]).map(toThread),
    total,
  };
}

function toObjectId(value: string): Types.ObjectId | null {
  if (!Types.ObjectId.isValid(value)) return null;
  return new Types.ObjectId(value);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toAuthor(id: Types.ObjectId | null | undefined, name: string): ForumAuthor {
  return {
    ...(id ? { id: id.toString() } : {}),
    name,
    initials: toInitials(name),
  };
}

function toThread(doc: ThreadRecord): ForumThread {
  return {
    id: doc._id.toString(),
    section: doc.section,
    title: doc.title,
    author: toAuthor(doc.authorId ?? null, doc.authorName),
    tags: doc.tags ?? [],
    isPinned: doc.isPinned ?? false,
    isClosed: doc.isClosed ?? false,
    viewsCount: doc.viewsCount ?? 0,
    repliesCount: doc.repliesCount ?? 0,
    createdAt: doc.createdAt ?? new Date(0),
    lastActivityAt: doc.lastActivityAt ?? doc.createdAt ?? new Date(0),
  };
}

function toPost(doc: PostRecord): ForumPost {
  return {
    id: doc._id.toString(),
    threadId: doc.threadId.toString(),
    author: toAuthor(doc.authorId ?? null, doc.authorName),
    text: doc.text,
    createdAt: doc.createdAt ?? new Date(0),
  };
}
