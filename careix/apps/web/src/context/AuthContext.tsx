import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { MeResponse, UserDto } from "@careix/shared";
import { api, setToken } from "../api/client";

interface AuthContextValue {
  user: UserDto | null;
  pet: MeResponse["pet"];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [pet, setPet] = useState<MeResponse["pet"]>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.me();
      setUser(data.user);
      setPet(data.pet);
    } catch {
      setUser(null);
      setPet(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("careix_token");
    if (!token) {
      setLoading(false);
      return;
    }
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    const me = await api.me();
    setPet(me.pet);
  };

  const register = async (email: string, password: string) => {
    const data = await api.register({ email, password });
    setToken(data.token);
    setUser(data.user);
    setPet(null);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPet(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, pet, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
