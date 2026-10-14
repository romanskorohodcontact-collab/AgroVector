import type { Types } from "mongoose";
import { connectDb } from "@/server/db/connection";
import { UserModel } from "@/server/db/models/user";

export interface UserRecord {
  _id: Types.ObjectId;
  phone: string;
  passwordHash: string;
  email?: string;
  companyName?: string;
  name?: string;
}

export interface UserProfileFields {
  email?: string;
  companyName?: string;
  name?: string;
}

export async function createUser(data: {
  phone: string;
  passwordHash: string;
}): Promise<UserRecord> {
  await connectDb();
  const doc = await UserModel.create(data);
  return doc.toObject() as unknown as UserRecord;
}

export async function findUserByPhone(phone: string): Promise<UserRecord | null> {
  await connectDb();
  const doc = await UserModel.findOne({ phone }).lean();
  return doc as unknown as UserRecord | null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  await connectDb();
  const doc = await UserModel.findById(id).lean();
  return doc as unknown as UserRecord | null;
}

export async function updateUserProfile(
  id: string,
  data: UserProfileFields,
): Promise<UserRecord | null> {
  await connectDb();
  const doc = await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  return doc as unknown as UserRecord | null;
}
