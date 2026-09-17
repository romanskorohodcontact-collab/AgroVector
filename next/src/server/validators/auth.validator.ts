export interface RegisterInput {
  phone: string;
  password: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface ProfileInput {
  email?: string;
  companyName?: string;
  name?: string;
}

export function validateRegisterInput(raw: unknown): RegisterInput {
  const data = isRecord(raw)
    ? raw
    : ({} as Record<string, unknown>);
  const phone = normalizePhone(data.phone);
  const password = requiredString(data.password, "Пароль");
  const passwordConfirm = requiredString(
    data.passwordConfirm,
    "Повтор пароля"
  );
  if (password.length < 6) {
    throw new Error("Пароль должен содержать не менее 6 символов");
  }
  if (password !== passwordConfirm) {
    throw new Error("Пароли не совпадают");
  }
  return { phone, password };
}

export function validateLoginInput(raw: unknown): LoginInput {
  const data = isRecord(raw)
    ? raw
    : ({} as Record<string, unknown>);
  return {
    phone: normalizePhone(data.phone),
    password: requiredString(data.password, "Пароль"),
  };
}

export function validateProfileInput(raw: unknown): ProfileInput {
  if (!isRecord(raw)) {
    throw new Error("Некорректные данные");
  }
  const profile: ProfileInput = {};
  const email = optionalString(raw.email);
  if (email.length > 0 && !email.includes("@")) {
    throw new Error("Некорректный email");
  }
  if (email) profile.email = email;
  const companyName = optionalString(raw.companyName);
  if (companyName) profile.companyName = companyName;
  const name = optionalString(raw.name);
  if (name) profile.name = name;
  return profile;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} обязателен`);
  }
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown): string {
  const raw = requiredString(value, "Телефон");
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 11 || digits.length > 15) {
    throw new Error(
      "Телефон должен содержать от 11 до 15 цифр (например, +7 900 000-00-01)"
    );
  }
  if (digits.length === 11 && digits.startsWith("8")) {
    return "7" + digits.slice(1);
  }
  return digits;
}