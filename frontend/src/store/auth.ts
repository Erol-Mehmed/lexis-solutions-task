import { create } from "zustand";
import { API_BASE_URL } from "../config/env.ts";

type User = {
  id: number;
  username: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const API = `${API_BASE_URL}/api/auth`;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  register: async (username, password) => {
    const res = await fetch(`${API}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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
    const res = await fetch(`${API}/me/`, {
      credentials: "include",
    });

    if (!res.ok) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    const data = await res.json();
    set({ user: data, isAuthenticated: true });
  },

  logout: async () => {
    await fetch(`${API}/logout/`, {
      method: "POST",
      credentials: "include",
    });

    set({ user: null, isAuthenticated: false });
  },
}));
