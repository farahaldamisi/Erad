import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addUserAddress,
  clearSession,
  createAddress,
  ensureSeedUsers,
  getSessionUser,
  loginUser,
  registerUser,
  removeUserAddress,
  updateUserAddress,
  updateUserProfile,
  validatePhone,
  type PublicUser,
  type UserAddress,
} from "./auth-store";
import { logActivity } from "./activity";

export type AuthErrorCode =
  | "invalid_credentials"
  | "not_found"
  | "email_exists"
  | "weak_password"
  | "password_mismatch"
  | "invalid_email"
  | "name_required"
  | "phone_required"
  | "address_required";

interface AuthCtx {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ ok: true } | { ok: false; code: AuthErrorCode }>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    addresses: { label: string; address: string }[];
  }) => Promise<{ ok: true } | { ok: false; code: AuthErrorCode }>;
  addAddress: (label: string, address: string) => void;
  updateAddress: (addressId: string, label: string, address: string) => void;
  updateProfile: (name: string, phone: string) => boolean;
  removeAddress: (addressId: string) => void;
  logout: () => void;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(getSessionUser());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureSeedUsers();
      if (!cancelled) {
        setUser(getSessionUser());
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    const result = await loginUser(email, password, rememberMe);
    if (!result.ok) {
      return { ok: false as const, code: result.code };
    }
    setUser(result.user);
    logActivity({
      type: "login",
      userId: result.user.id,
      userName: result.user.name,
      userEmail: result.user.email,
      label: result.user.email,
    });
    return { ok: true as const };
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone: string;
      addresses: { label: string; address: string }[];
    }) => {
      const { validateEmail, validatePassword, validatePhone } = await import("./auth-store");
      if (!input.name.trim()) return { ok: false as const, code: "name_required" as const };
      if (!validateEmail(input.email)) return { ok: false as const, code: "invalid_email" as const };
      if (!validatePhone(input.phone)) return { ok: false as const, code: "phone_required" as const };
      if (!validatePassword(input.password)) return { ok: false as const, code: "weak_password" as const };
      if (input.password !== input.confirmPassword) {
        return { ok: false as const, code: "password_mismatch" as const };
      }

      const validAddresses = input.addresses.filter(a => a.address.trim());
      if (validAddresses.length === 0) {
        return { ok: false as const, code: "address_required" as const };
      }

      const result = await registerUser({
        name: input.name,
        email: input.email,
        password: input.password,
        phone: input.phone,
        addresses: validAddresses.map(a => createAddress(a.label, a.address)),
      });
      if (!result.ok) return { ok: false as const, code: "email_exists" as const };
      setUser(result.user);
      logActivity({
        type: "register",
        userId: result.user.id,
        userName: result.user.name,
        userEmail: result.user.email,
        label: result.user.email,
        meta: { phone: result.user.phone },
      });
      return { ok: true as const };
    },
    [],
  );

  const addAddress = useCallback((label: string, address: string) => {
    if (!user) return;
    const updated = addUserAddress(user.id, label, address);
    if (updated) {
      setUser(updated);
      logActivity({
        type: "address_add",
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        label: label || address,
        meta: { address },
      });
    }
  }, [user]);

  const updateAddress = useCallback((addressId: string, label: string, address: string) => {
    if (!user || !address.trim()) return;
    const updated = updateUserAddress(user.id, addressId, label, address);
    if (updated) setUser(updated);
  }, [user]);

  const updateProfile = useCallback((name: string, phone: string) => {
    if (!user) return false;
    if (!name.trim() || !validatePhone(phone)) return false;
    const updated = updateUserProfile(user.id, { name: name.trim(), phone: phone.trim() });
    if (updated) setUser(updated);
    return !!updated;
  }, [user]);

  const removeAddress = useCallback((addressId: string) => {
    if (!user) return;
    const updated = removeUserAddress(user.id, addressId);
    if (updated) setUser(updated);
  }, [user]);

  const logout = useCallback(() => {
    if (user) {
      logActivity({
        type: "logout",
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        label: user.email,
      });
    }
    clearSession();
    setUser(null);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      register,
      addAddress,
      updateAddress,
      updateProfile,
      removeAddress,
      logout,
      refresh,
    }),
    [user, isLoading, login, register, addAddress, updateAddress, updateProfile, removeAddress, logout, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

export type { PublicUser, UserAddress };
