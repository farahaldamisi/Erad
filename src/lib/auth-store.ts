export type UserRole = "admin" | "customer";

export interface UserAddress {
  id: string;
  label: string;
  address: string;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  addresses: UserAddress[];
  role: UserRole;
  passwordHash: string;
  /** Stored for display in account panel (local demo). */
  passwordPlain?: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  expiresAt: number;
}

export type PublicUser = Pick<StoredUser, "id" | "email" | "name" | "phone" | "addresses" | "role">;

const USERS_KEY = "erad_users_v1";
const SESSION_KEY = "erad_session_v1";

const SESSION_MS = 1000 * 60 * 60 * 24 * 7;
const REMEMBER_MS = 1000 * 60 * 60 * 24 * 30;

const SEED_ADMIN = {
  email: "admin@erad.com",
  password: "admin123",
  name: "ERAD Admin",
  role: "admin" as const,
};

function normalizeUser(user: StoredUser): StoredUser {
  return {
    ...user,
    phone: user.phone ?? "",
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
  };
}

function toPublicUser(user: StoredUser): PublicUser {
  const u = normalizeUser(user);
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    addresses: u.addresses,
    role: u.role,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]).map(normalizeUser) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users.map(normalizeUser)));
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function writeSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}

export function createAddress(label: string, address: string): UserAddress {
  return { id: `addr-${crypto.randomUUID()}`, label: label.trim() || "Address", address: address.trim() };
}

export async function ensureSeedUsers(): Promise<void> {
  if (typeof window === "undefined") return;
  const users = readUsers();
  const adminIdx = users.findIndex(u => u.email.toLowerCase() === SEED_ADMIN.email);

  if (adminIdx !== -1) {
    const admin = users[adminIdx];
    const seedHash = await hashPassword(SEED_ADMIN.password);
    const nextPasswordPlain =
      admin.passwordPlain ??
      (admin.passwordHash === seedHash ? SEED_ADMIN.password : undefined);
    const nextAddresses =
      Array.isArray(admin.addresses) && admin.addresses.length > 0
        ? admin.addresses
        : [createAddress("Office", "Amman, Jordan")];
    const next = normalizeUser({
      ...admin,
      name: admin.name?.trim() || SEED_ADMIN.name,
      phone: admin.phone?.trim() || "0793315007",
      passwordPlain: nextPasswordPlain,
      addresses: nextAddresses,
    });
    const prev = normalizeUser(admin);
    if (
      next.name !== prev.name ||
      next.phone !== prev.phone ||
      next.passwordPlain !== prev.passwordPlain ||
      JSON.stringify(next.addresses) !== JSON.stringify(prev.addresses)
    ) {
      users[adminIdx] = next;
      writeUsers(users);
    }
    return;
  }

  const passwordHash = await hashPassword(SEED_ADMIN.password);
  writeUsers([
    ...users,
    normalizeUser({
      id: "user-admin",
      email: SEED_ADMIN.email,
      name: SEED_ADMIN.name,
      phone: "0793315007",
      addresses: [createAddress("Office", "Amman, Jordan")],
      role: SEED_ADMIN.role,
      passwordHash,
      passwordPlain: SEED_ADMIN.password,
      createdAt: new Date().toISOString(),
    }),
  ]);
}

export function getAdminPasswordPlain(userId: string): string {
  return getUserPasswordPlain(userId);
}

export function getUserPasswordPlain(userId: string): string {
  const user = readUsers().find(u => u.id === userId);
  if (!user) return "";
  return user.passwordPlain ?? "";
}

export async function updateUserPassword(
  userId: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; code: "not_found" | "weak_password" }> {
  if (!validatePassword(newPassword)) return { ok: false, code: "weak_password" };

  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { ok: false, code: "not_found" };

  const passwordHash = await hashPassword(newPassword);
  users[idx] = normalizeUser({
    ...users[idx],
    passwordHash,
    passwordPlain: newPassword,
  });
  writeUsers(users);
  return { ok: true };
}

export function getSessionUser(): PublicUser | null {
  const session = readSession();
  if (!session) return null;
  const user = readUsers().find(u => u.id === session.userId);
  if (!user) {
    clearSession();
    return null;
  }
  return toPublicUser(user);
}

export function getUserById(id: string): PublicUser | null {
  const user = readUsers().find(u => u.id === id);
  return user ? toPublicUser(user) : null;
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe = false,
): Promise<{ ok: true; user: PublicUser } | { ok: false; code: "invalid_credentials" | "not_found" }> {
  await ensureSeedUsers();
  const normalized = email.trim().toLowerCase();
  const user = readUsers().find(u => u.email.toLowerCase() === normalized);
  if (!user) return { ok: false, code: "not_found" };

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) return { ok: false, code: "invalid_credentials" };

  const ttl = rememberMe ? REMEMBER_MS : SESSION_MS;
  writeSession({ userId: user.id, expiresAt: Date.now() + ttl });
  return { ok: true, user: toPublicUser(user) };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
  addresses: UserAddress[];
}): Promise<{ ok: true; user: PublicUser } | { ok: false; code: "email_exists" }> {
  await ensureSeedUsers();
  const normalized = input.email.trim().toLowerCase();
  if (readUsers().some(u => u.email.toLowerCase() === normalized)) {
    return { ok: false, code: "email_exists" };
  }

  const passwordHash = await hashPassword(input.password);
  const user: StoredUser = normalizeUser({
    id: `user-${crypto.randomUUID()}`,
    email: normalized,
    name: input.name.trim(),
    phone: input.phone.trim(),
    addresses: input.addresses,
    role: "customer",
    passwordHash,
    passwordPlain: input.password,
    createdAt: new Date().toISOString(),
  });
  writeUsers([...readUsers(), user]);
  writeSession({ userId: user.id, expiresAt: Date.now() + SESSION_MS });
  return { ok: true, user: toPublicUser(user) };
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Pick<StoredUser, "name" | "phone" | "email">>,
):
  | { ok: true; user: PublicUser }
  | { ok: false; code: "not_found" | "email_exists" | "invalid_email" | "phone_required" | "name_required" } {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { ok: false, code: "not_found" };

  const current = users[idx];
  const next = { ...current };

  if (updates.name !== undefined) {
    if (!updates.name.trim()) return { ok: false, code: "name_required" };
    next.name = updates.name.trim();
  }
  if (updates.email !== undefined) {
    const email = updates.email.trim().toLowerCase();
    if (!validateEmail(email)) return { ok: false, code: "invalid_email" };
    if (users.some(u => u.id !== userId && u.email.toLowerCase() === email)) {
      return { ok: false, code: "email_exists" };
    }
    next.email = email;
  }
  if (updates.phone !== undefined) {
    if (!validatePhone(updates.phone)) return { ok: false, code: "phone_required" };
    next.phone = updates.phone.trim();
  }

  users[idx] = normalizeUser(next);
  writeUsers(users);
  return { ok: true, user: toPublicUser(users[idx]) };
}

export function addUserAddress(userId: string, label: string, address: string): PublicUser | null {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  users[idx].addresses = [...users[idx].addresses, createAddress(label, address)];
  writeUsers(users);
  return toPublicUser(users[idx]);
}

export function updateUserAddress(
  userId: string,
  addressId: string,
  label: string,
  address: string,
): PublicUser | null {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  users[idx].addresses = users[idx].addresses.map(a =>
    a.id === addressId
      ? { ...a, label: label.trim() || a.label, address: address.trim() }
      : a,
  );
  writeUsers(users);
  return toPublicUser(users[idx]);
}

export function removeUserAddress(userId: string, addressId: string): PublicUser | null {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  users[idx].addresses = users[idx].addresses.filter(a => a.id !== addressId);
  writeUsers(users);
  return toPublicUser(users[idx]);
}

export function deleteUser(userId: string): { ok: true } | { ok: false; code: "not_found" | "cannot_delete_admin" } {
  const users = readUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return { ok: false, code: "not_found" };
  if (target.role === "admin") return { ok: false, code: "cannot_delete_admin" };

  writeUsers(users.filter(u => u.id !== userId));

  const session = readSession();
  if (session?.userId === userId) clearSession();

  return { ok: true };
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export type CustomerRecord = PublicUser & { createdAt: string };

export function listRegisteredCustomers(): CustomerRecord[] {
  return readUsers()
    .filter(u => u.role === "customer")
    .map(u => ({
      ...toPublicUser(u),
      createdAt: u.createdAt ?? new Date(0).toISOString(),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
