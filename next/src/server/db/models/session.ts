import { model, models, Schema, type Model, type Types } from "mongoose";

export interface SessionFields {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const sessionSchema = new Schema<SessionFields>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel: Model<SessionFields> =
  (models.Session as Model<SessionFields>) || model<SessionFields>("Session", sessionSchema);
