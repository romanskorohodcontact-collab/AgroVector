import type { User } from "@/entities/user/model";
import { hashPassword, verifyPassword } from "@/server/services/password";
import {
  createSessionToken,
  getSessionTokenFromCookies,
  sessionExpiresAt,
} from "@/server/services/session";
import {
  createSession,
  deleteSessionByToken,
  findSessionByToken,
} from "@/server/repositories/sessions.repository";
import {
  createUser,
  findUserByPhone,
  findUserById,
  updateUserProfile,
  type UserRecord,
} from "@/server/repositories/users.repository";
import {
  validateLoginInput,
  validateProfileInput,
  validateRegisterInput,
} from "@/server/validators/auth.validator";

export interface AuthResult {
  user: User;
  sessionToken: string;
}

export async function registerUser(input: unknown): Promise<AuthResult> {
  const { phone, password } = validateRegisterInput(input);
  const existing = await findUserByPhone(phone);
  if (existing) {
    throw new Error("Пользователь с таким телефоном уже зарегистрирован");
  }
  const passwordHash = await hashPassword(password);
  const user = await createUser({ phone, passwordHash });
  return {
    user: toPublicUser(user),
    sessionToken: await createSessionForUser(user._id.toString()),
  };
}

export async function loginUser(input: unknown): Promise<AuthResult | null> {
  const { phone, password } = validateLoginInput(input);
  const user = await findUserByPhone(phone);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return {
    user: toPublicUser(user),
    sessionToken: await createSessionForUser(user._id.toString()),
  };
}

export async function logoutUser(): Promise<void> {
  const token = await getSessionTokenFromCookies();
  if (token) {
    await deleteSessionByToken(token);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;
  const session = await findSessionByToken(token);
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) return null;
  const user = await findUserById(session.userId.toString());
  return user ? toPublicUser(user) : null;
}

export async function updateProfile(input: unknown): Promise<Partial<User>> {
  const profile = validateProfileInput(input);
  const user = await getCurrentUser();
  if (!user) throw new Error("Не авторизован");
  const updated = await updateUserProfile(user.id, profile);
  if (!updated) throw new Error("Пользователь не найден");
  return toPublicUser(updated);
}

async function createSessionForUser(userId: string): Promise<string> {
  const token = createSessionToken();
  await createSession({
    token,
    userId,
    expiresAt: sessionExpiresAt(),
  });
  return token;
}

function toPublicUser(user: UserRecord): User {
  return {
    id: user._id.toString(),
    phone: user.phone,
    ...(user.email ? { email: user.email } : {}),
    ...(user.companyName ? { companyName: user.companyName } : {}),
    ...(user.name ? { name: user.name } : {}),
  };
}