import type { TransportInputData } from "@/server/repositories/transports.repository";

export function validateTransportInput(raw: unknown): TransportInputData {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные формы");
  }

  const transportType = requiredString(raw.transportType, "Тип транспорта");
  const bodyType = requiredString(raw.bodyType, "Тип кузова");
  const cargoTypes = requiredStringArray(raw.cargoTypes, "Типы грузов");
  const workDistricts = requiredStringArray(raw.workDistricts, "Федеральные округа");
  const vatType = requiredString(raw.vatType, "Условия НДС");
  const contactName = requiredString(raw.contactName, "Контактное лицо");
  const contactPhone = requiredString(raw.contactPhone, "Телефон");

  const availability = validateAvailability(raw.availability);
  const transportLocation = validateLocation(raw.transportLocation);

  return {
    transportType,
    bodyType,
    loadCapacityTons: optionalNumber(raw.loadCapacityTons, "Грузоподъёмность"),
    bodyVolumeM3: optionalNumber(raw.bodyVolumeM3, "Объём кузова"),
    cargoTypes,
    loadingType: optionalStringArray(raw.loadingType),
    unloadingType: optionalStringArray(raw.unloadingType),
    workRegions: optionalStringArray(raw.workRegions),
    workDistricts,
    minRatePerKm: optionalNumber(raw.minRatePerKm, "Ставка за километр"),
    minTripRate: optionalNumber(raw.minTripRate, "Стоимость рейса"),
    vatType,
    availability,
    transportLocation,
    additionalInfo: optionalString(raw.additionalInfo),
    contactName,
    contactPhone,
  };
}

function validateAvailability(value: unknown): { type: string; date: Date | null } {
  if (!isRecord(value)) {
    throw new Error("Некорректные данные доступности");
  }
  const type = requiredString(value.type, "Тип доступности");
  const date = optionalDate(value.date);
  return { type, date };
}

function validateLocation(value: unknown): { lat: number; lng: number } {
  if (!isRecord(value)) {
    throw new Error("Точка на карте не выбрана");
  }
  return {
    lat: numberInRange(value.lat, -90, 90, "Широта должна быть от -90 до 90"),
    lng: numberInRange(value.lng, -180, 180, "Долгота должна быть от -180 до 180"),
  };
}

function numberInRange(value: unknown, min: number, max: number, message: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(message);
  }
  return number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} обязательно`);
  }
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function requiredStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} обязательно (минимум одно значение)`);
  }
  const result = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  if (result.length === 0) {
    throw new Error(`${field} обязательно (минимум одно значение)`);
  }
  return result;
}

function optionalStringArray(value: unknown): string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Array.isArray(value)) {
    return null;
  }
  const result = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return result.length > 0 ? result : null;
}

function optionalNumber(value: unknown, field: string): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${field} должно быть неотрицательным числом`);
  }
  return number;
}

function optionalDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}
