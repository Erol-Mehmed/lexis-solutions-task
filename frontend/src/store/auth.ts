import { create } from "zustand";
import { api, clearTokens, getRefreshToken, setTokens } from "../api/client.ts";

type User = {
  id: number;
  username: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (username, email, password) => {
    await api.post("/api/auth/register/", { username, email, password });
  },

  login: async (username, password) => {
    const res = await api.post("/api/auth/token/", { username, password });
    setTokens(res.data.access, res.data.refresh);
    await useAuthStore.getState().fetchMe();
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  fetchMe: async () => {
    try {
      const res = await api.get("/api/auth/me/");
      set({
        user: res.data,
        isAuthenticated: true,
      });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await api.post("/api/auth/logout/", { refresh });
      } catch {
        // Ignore logout API errors; client cleanup still happens.
      }
    }

    clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
