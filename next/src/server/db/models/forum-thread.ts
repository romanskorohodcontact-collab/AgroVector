import { model, models, Schema, type Model, type Types } from "mongoose";
import type { ForumSectionSlug } from "@/entities/forum/model";

export interface ForumThreadFields {
  section: ForumSectionSlug;
  title: string;
  body: string;
  authorId?: Types.ObjectId | null;
  authorName: string;
  tags: string[];
  isPinned: boolean;
  isClosed: boolean;
  viewsCount: number;
  repliesCount: number;
  lastActivityAt: Date;
}

const forumThreadSchema = new Schema<ForumThreadFields>(
  {
    section: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    authorName: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    lastActivityAt: { type: Date, required: true },
  },
  { timestamps: true },
);

forumThreadSchema.index({ section: 1, isPinned: -1, lastActivityAt: -1 });
forumThreadSchema.index({ lastActivityAt: -1 });

export const ForumThreadModel: Model<ForumThreadFields> =
  (models.ForumThread as Model<ForumThreadFields>) ||
  model<ForumThreadFields>("ForumThread", forumThreadSchema);
