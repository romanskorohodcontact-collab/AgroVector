import { AVAILABILITY_DATE_TYPES } from "./options";

export interface AvailabilityDisplay {
  type: string;
  date: string | null;
}

export function getAvailabilityDisplay(
  type: string,
  date: Date | null,
): AvailabilityDisplay {
  const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(type);
  const expired =
    isDateType &&
    date !== null &&
    date.getTime() <= Date.now();

  const effectiveType = expired ? "Свободен" : type;
  const showDate = !expired && isDateType && date !== null;

  return {
    type: effectiveType,
    date: showDate
      ? new Date(date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        })
      : null,
  };
}
