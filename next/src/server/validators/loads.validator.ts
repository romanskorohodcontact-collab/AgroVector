import type { LoadInputData } from "@/server/repositories/loads.repository";

export function validateLoadInput(raw: unknown): LoadInputData {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные формы");
  }

  const loadingPlace = requiredString(raw.loadingPlace, "Место погрузки");
  const loadingLocation = location(raw.loadingLocation);
  const unloadingPlace = requiredString(raw.unloadingPlace, "Место выгрузки");
  const cargo = requiredString(raw.cargo, "Груз");
  const cargoForm = requiredString(raw.cargoForm, "Тип загрузки груза");
  const bodyType = requiredString(raw.bodyType, "Тип кузова");
  const cargoTypes = requiredStringArray(raw.cargoTypes, "Типы грузов");
  const customerName = requiredString(raw.customerName, "Имя заказчика");
  const customerPhone = requiredString(raw.customerPhone, "Телефон заказчика");
  const companyName = requiredString(raw.companyName, "Название компании");
  const loadingDistrict = requiredStringArray(raw.loadingDistrict, "Федеральные округа погрузки");
  const unloadingDistrict = requiredStringArray(raw.unloadingDistrict, "Федеральные округа выгрузки");
  const vatType = requiredString(raw.vatType, "Условия НДС");
  const loadingDate = requiredDate(raw.loadingDate, "Дата погрузки");
  const distance = positiveNumber(raw.distance, "Расстояние");
  const ratePerKm = optionalPositiveNumber(raw.ratePerKm, "Ставка за км");
  const rate = optionalPositiveNumber(raw.rate, "Ставка за рейс");

  if (ratePerKm == null && rate == null) {
    throw new Error("Необходимо указать ставку за км или ставку за рейс");
  }

  const finalRatePerKm = ratePerKm ?? (distance > 0 ? rate! / distance : 0);
  const finalRate = ratePerKm != null ? ratePerKm * distance : rate!;
  const tonnage = validateTonnage(raw.tonnage);

  return {
    loadingPlace,
    loadingLocation,
    unloadingPlace,
    distance,
    rate: finalRate,
    ratePerKm: finalRatePerKm,
    tonnage,
    bodyType,
    cargo,
    cargoForm,
    cargoTypes,
    additionalInfo: optionalString(raw.additionalInfo),
    customerName,
    customerPhone,
    companyName,
    loadingRegion: optionalStringArray(raw.loadingRegion),
    loadingDistrict,
    unloadingDistrict,
    unloadingRegion: optionalStringArray(raw.unloadingRegion),
    loadingType: optionalStringArray(raw.loadingType),
    unloadingType: optionalStringArray(raw.unloadingType),
    vatType,
    loadingDate,
    customProperties: optionalCustomProperties(raw.customProperties),
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

function optionalPositiveNumber(value: unknown, field: string): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${field} должно быть положительным числом`);
  }
  return number;
}

function validateTonnage(value: unknown): { tonnageWeight: number; tonnageUnit: "kg" | "ton" } {
  if (!isRecord(value)) {
    throw new Error("Тоннаж должен быть объектом");
  }
  const tonnageWeight = positiveNumber(value.tonnageWeight, "Вес груза");
  const tonnageUnit = value.tonnageUnit;
  if (tonnageUnit !== "kg" && tonnageUnit !== "ton") {
    throw new Error("Единица измерения тоннажа должна быть 'kg' или 'ton'");
  }
  return { tonnageWeight, tonnageUnit };
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

function requiredDate(value: unknown, field: string): Date {
  if (value === null || value === undefined || value === "") {
    throw new Error(`${field} обязательно`);
  }
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} некорректная дата`);
  }
  return date;
}

function optionalCustomProperties(
  value: unknown
): { name: string; value: string }[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const name =
      typeof item.name === "string" ? item.name.trim().slice(0, 200) : "";
    const propValue =
      typeof item.value === "string" ? item.value.trim().slice(0, 1000) : "";
    return name && propValue ? [{ name, value: propValue }] : [];
  });
}