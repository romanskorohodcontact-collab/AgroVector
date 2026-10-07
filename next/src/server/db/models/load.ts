import { model, models, Schema, type Model, type Types } from "mongoose";

export interface LoadFields {
  userId: Types.ObjectId;
  loadingPlace: string;
  loadingLocation: {
    lat: number;
    lng: number;
  };
  unloadingPlace: string;
  distance: number;
  rate: number;
  ratePerKm: number;
  tonnage: {
    tonnageWeight: number;
    tonnageUnit: "kg" | "ton";
  };
  bodyType: string[];
  cargo: string;
  cargoForm: string;
  cargoTypes: string[];
  additionalInfo: string;
  customerName: string;
  customerPhone: string;
  companyName: string;
  loadingRegion: string[] | null;
  loadingDistrict: string[];
  unloadingDistrict: string[];
  unloadingRegion: string[] | null;
  loadingType: string[] | null;
  unloadingType: string[] | null;
  vatType: string[];
  loadingDate: Date | null;
  advance: string | null;
  customProperties: { name: string; value: string }[];
}

const loadSchema = new Schema<LoadFields>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    loadingPlace: { type: String, required: true },
    loadingLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    unloadingPlace: { type: String, required: true },
    distance: { type: Number, required: true },
    rate: { type: Number, required: true },
    ratePerKm: { type: Number, required: true },
    tonnage: {
      tonnageWeight: { type: Number, required: true },
      tonnageUnit: { type: String, required: true, enum: ["kg", "ton"] },
    },
    bodyType: { type: [String], required: true },
    cargo: { type: String, required: true },
    cargoForm: { type: String, default: "" },
    cargoTypes: { type: [String], required: true },
    additionalInfo: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    companyName: { type: String, default: "" },
    loadingRegion: { type: [String], default: null },
    loadingDistrict: { type: [String], required: true },
    unloadingDistrict: { type: [String], required: true },
    unloadingRegion: { type: [String], default: null },
    loadingType: { type: [String], default: null },
    unloadingType: { type: [String], default: null },
    vatType: { type: [String], required: true },
    loadingDate: { type: Date, default: null },
    advance: { type: String, default: null },
    customProperties: {
      type: [{ _id: false, name: String, value: String }],
      default: [],
    },
  },
  { timestamps: true }
);

loadSchema.index({ userId: 1, createdAt: -1 });

export const LoadModel: Model<LoadFields> =
  (models.Load as Model<LoadFields>) ||
  model<LoadFields>("Load", loadSchema);