// lib/auth-context.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  logout as apiLogout,
  getProfile,
} from "@/lib/api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  authChecked: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  finishLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const finishLogin = () => setIsLoggingIn(false);

  // 🔐 Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        console.log("ME RESPONSE:", res);
        if (res?.user) setUser(res.user);
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // 🔑 Login
  const login = async (username: string, password: string) => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);

    try {
      const res = await apiLogin(username, password);

      if (!res?.user) {
        throw new Error("Login gagal");
      }

      setUser(res.user);
      router.replace("/dashboard");
    } catch (err) {
      setIsLoggingIn(false);
      throw err;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      router.replace("/auth/login");
    }
  };

  console.log("AUTH STATE:", { user, isLoading });
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authChecked,
        isLoggingIn,
        login,
        logout,
        finishLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
