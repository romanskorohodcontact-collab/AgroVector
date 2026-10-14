import { model, models, Schema, type Model } from "mongoose";

export interface UserFields {
  phone: string;
  passwordHash: string;
  email?: string;
  companyName?: string;
  name?: string;
}

const userSchema = new Schema<UserFields>(
  {
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String },
    companyName: { type: String },
    name: { type: String },
  },
  { timestamps: true },
);

export const UserModel: Model<UserFields> =
  (models.User as Model<UserFields>) || model<UserFields>("User", userSchema);
