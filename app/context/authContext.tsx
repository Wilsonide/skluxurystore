import React, { createContext, useState, useEffect, useCallback } from "react";
import { Axios } from "@/lib/axios";

export type AuthType = {
  id: string;
  access_token: string;
  email: string;
  user_name: string;
  full_name: string;
  role: string;
  profile?: string;
  is_verified: boolean;
};

type AuthContextType = {
  Auth: AuthType | null;
  loading: boolean;
  setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  Auth: null,
  loading: true,
  setAuth: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [Auth, setAuth] = useState<AuthType | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh user on mount
  const refreshUser = useCallback(async () => {
    try {
      const resp = await Axios.post(
        "/auth/refresh",
        {},
        { withCredentials: true },
      );
      const access_token = resp.data.access_token;

      const userRes = await Axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setAuth({ ...userRes.data, access_token });
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setAuth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      await refreshUser();
    };

    void fetchUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await Axios.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      /* empty */
    }
    setAuth(null); // this will trigger PresenceProvider cleanup
  }, []);

  return (
    <AuthContext.Provider
      value={{ Auth, loading, setAuth, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
