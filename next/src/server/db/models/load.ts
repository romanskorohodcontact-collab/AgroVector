import { model, models, Schema, type Model } from "mongoose";

export interface LoadFields {
  loadingPlace: string;
  loadingLocation: {
    lat: number;
    lng: number;
  };
  unloadingPlace: string;
  distance: number;
  rate: number;
  tonnage: number;
  cargo: string;
  additionalInfo: string;
  customerName: string;
  customerPhone: string;
  companyName: string;
}

const loadSchema = new Schema<LoadFields>(
  {
    loadingPlace: { type: String, required: true },
    loadingLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    unloadingPlace: { type: String, required: true },
    distance: { type: Number, required: true },
    rate: { type: Number, required: true },
    tonnage: { type: Number, required: true },
    cargo: { type: String, required: true },
    additionalInfo: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    companyName: { type: String, required: true },
  },
  { timestamps: true }
);

export const LoadModel: Model<LoadFields> =
  (models.Load as Model<LoadFields>) ||
  model<LoadFields>("Load", loadSchema);