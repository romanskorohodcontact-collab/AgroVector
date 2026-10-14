import type { Types } from "mongoose";
import { connectDb } from "@/server/db/connection";
import { SessionModel } from "@/server/db/models/session";

export interface SessionRecord {
  _id: Types.ObjectId;
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

export async function createSession(data: {
  token: string;
  userId: string;
  expiresAt: Date;
}): Promise<void> {
  await connectDb();
  await SessionModel.create(data);
}

export async function findSessionByToken(token: string): Promise<SessionRecord | null> {
  await connectDb();
  const doc = await SessionModel.findOne({ token }).lean();
  return doc as unknown as SessionRecord | null;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await connectDb();
  await SessionModel.deleteOne({ token });
}
