import { model, models, Schema, type Model, type Types } from "mongoose";

export interface TransportFields {
  userId: Types.ObjectId;
  transportType: string;
  bodyType: string;
  loadCapacityTons: number | null;
  bodyVolumeM3: number | null;
  cargoTypes: string[];
  loadingType: string[] | null;
  unloadingType: string[] | null;
  workRegions: string[] | null;
  workDistricts: string[];
  minRatePerKm: number | null;
  minTripRate: number | null;
  vatType: string;
  availability: {
    type: string;
    date: Date | null;
  };
  transportLocation: {
    lat: number;
    lng: number;
  };
  additionalInfo: string;
  contactName: string;
  contactPhone: string;
}

const transportSchema = new Schema<TransportFields>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transportType: { type: String, required: true },
    bodyType: { type: String, required: true },
    loadCapacityTons: { type: Number, default: null },
    bodyVolumeM3: { type: Number, default: null },
    cargoTypes: { type: [String], required: true },
    loadingType: { type: [String], default: null },
    unloadingType: { type: [String], default: null },
    workRegions: { type: [String], default: null },
    workDistricts: { type: [String], required: true },
    minRatePerKm: { type: Number, default: null },
    minTripRate: { type: Number, default: null },
    vatType: { type: String, required: true },
    availability: {
      type: { type: String, required: true },
      date: { type: Date, default: null },
    },
    transportLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    additionalInfo: { type: String, default: "" },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },
  { timestamps: true },
);

transportSchema.index({ userId: 1, createdAt: -1 });

export const TransportModel: Model<TransportFields> =
  (models.Transport as Model<TransportFields>) ||
  model<TransportFields>("Transport", transportSchema);
