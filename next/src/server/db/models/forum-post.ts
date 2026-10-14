import { model, models, Schema, type Model, type Types } from "mongoose";

export interface ForumPostFields {
  threadId: Types.ObjectId;
  authorId?: Types.ObjectId | null;
  authorName: string;
  text: string;
}

const forumPostSchema = new Schema<ForumPostFields>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "ForumThread",
      required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

forumPostSchema.index({ threadId: 1, createdAt: 1 });

export const ForumPostModel: Model<ForumPostFields> =
  (models.ForumPost as Model<ForumPostFields>) ||
  model<ForumPostFields>("ForumPost", forumPostSchema);
