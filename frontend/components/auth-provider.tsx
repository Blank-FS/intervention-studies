"use client";

import { LoggedInUser } from "@/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: LoggedInUser | null;
  setUser: (user: LoggedInUser | null) => void;
  refresh: () => Promise<LoggedInUser | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const refresh = async (): Promise<LoggedInUser | null> => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.loggedInUser);
      return data.loggedInUser;
    } else {
      setUser(null);
      return null;
    }
  };

  // run once on app load
  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
