import { create } from "zustand";
import { API_BASE_URL } from "../config/env.ts";

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

const API = `${API_BASE_URL}/api/auth`;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (username, email, password) => {
    const res = await fetch(`${API}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) throw new Error("Register failed");
  },

  login: async (username, password) => {
    const res = await fetch(`${API}/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    await useAuthStore.getState().fetchMe();
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  fetchMe: async () => {
    try {
      const res = await fetch(`${API}/me/`, {
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const data = await res.json();

      set({
        user: data,
        isAuthenticated: true,
      });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await fetch(`${API}/logout/`, {
      method: "POST",
      credentials: "include",
    });

    set({ user: null, isAuthenticated: false });
  },
}));
