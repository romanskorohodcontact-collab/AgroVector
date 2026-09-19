import { AVAILABILITY_DATE_TYPES } from "./options";

export interface AvailabilityDisplay {
  type: string;
  date: string | null;
}

export function getAvailabilityDisplay(
  type: string,
  date: Date | string | null,
): AvailabilityDisplay {
  const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(type);
  const parsed = date instanceof Date ? date : date ? new Date(date) : null;
  const validDate = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
  const expired =
    isDateType &&
    validDate !== null &&
    validDate.getTime() <= Date.now();

  const effectiveType = expired ? "Свободен" : type;
  const showDate = !expired && isDateType && validDate !== null;

  return {
    type: effectiveType,
    date: showDate
      ? validDate!.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        })
      : null,
  };
}
