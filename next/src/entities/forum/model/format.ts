export function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  const single = parts[0] ?? "";
  if (single.length >= 2 && /^[A-Za-zА-Яа-я]/.test(single)) {
    return single.slice(0, 2).toUpperCase();
  }
  const digits = single.replace(/\D/g, "");
  return (digits.slice(-2) || single.slice(0, 2)).toUpperCase();
}

export function formatForumDate(date: Date | string): string {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "—";
  return value.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatForumDateTime(date: Date | string): string {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "—";
  const day = value.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  const time = value.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

export function pluralize(count: number, forms: [string, string, string]): string {
  const mod10 = Math.abs(count) % 10;
  const mod100 = Math.abs(count) % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function formatRepliesLabel(count: number): string {
  return pluralize(count, ["ответ", "ответа", "ответов"]);
}

export function formatThreadsLabel(count: number): string {
  return pluralize(count, ["тема", "темы", "тем"]);
}

export function formatResultsLabel(count: number): string {
  return pluralize(count, ["результат", "результата", "результатов"]);
}

export function formatSectionsLabel(count: number): string {
  return pluralize(count, ["раздел", "раздела", "разделов"]);
}

export function formatViewsLabel(count: number): string {
  return pluralize(count, ["просмотр", "просмотра", "просмотров"]);
}
