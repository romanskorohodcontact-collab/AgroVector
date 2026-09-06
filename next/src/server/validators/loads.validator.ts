import type { CreateLoadData } from "@/server/repositories/loads.repository";

export function validateLoadInput(raw: unknown): CreateLoadData {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные формы");
  }

  const loadingPlace = requiredString(raw.loadingPlace, "Место погрузки");
  const loadingLocation = location(raw.loadingLocation);
  const unloadingPlace = requiredString(raw.unloadingPlace, "Место выгрузки");
  const cargo = requiredString(raw.cargo, "Груз");
  const customerName = requiredString(raw.customerName, "Имя заказчика");
  const customerPhone = requiredString(raw.customerPhone, "Телефон заказчика");
  const companyName = requiredString(raw.companyName, "Название компании");

  return {
    loadingPlace,
    loadingLocation,
    unloadingPlace,
    distance: positiveNumber(raw.distance, "Расстояние"),
    rate: positiveNumber(raw.rate, "Ставка"),
    tonnage: positiveNumber(raw.tonnage, "Тоннаж"),
    cargo,
    additionalInfo: optionalString(raw.additionalInfo),
    customerName,
    customerPhone,
    companyName,
  };
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

function positiveNumber(value: unknown, field: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${field} должно быть положительным числом`);
  }
  return number;
}

function location(value: unknown): { lat: number; lng: number } {
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