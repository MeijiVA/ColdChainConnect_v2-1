import { create } from "zustand";
import { LoginRequest, LoginResponse } from "@shared/api";

export interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "driver";
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = localStorage.getItem(AUTH_USER_KEY);

  return {
    token,
    user: user ? (JSON.parse(user) as AuthUser) : null,
  };
};

const persistAuth = (token: string | null, user: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const useAuth = create<AuthStore>((set, get) => {
  const { user: storedUser, token: storedToken } = getStoredAuth();

  return {
    user: storedUser,
    token: storedToken,
    isAuthenticated: Boolean(storedToken),
    isLoading: false,
    error: null,

    login: async (credentials) => {
      set({ isLoading: true, error: null });

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          let message = "Login failed";
          try {
            const errorBody = (await response.json()) as { error?: string };
            if (errorBody.error) {
              message = errorBody.error;
            }
          } catch {
            message = response.status === 401 ? "Invalid username or password" : message;
          }
          throw new Error(message);
        }

        const data = (await response.json()) as LoginResponse;
        const normalizedUser: AuthUser = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
        };

        persistAuth(data.token, normalizedUser);

        set({
          token: data.token,
          user: normalizedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        set({ error: message, isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      const token = get().token;

      try {
        if (token) {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch {
        // Clear local state even if the server logout request fails.
      } finally {
        persistAuth(null, null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    },

    setToken: (token) => {
      const user = get().user;
      persistAuth(token, user);
      set({
        token,
        isAuthenticated: Boolean(token),
      });
    },

    setUser: (user) => {
      const token = get().token;
      persistAuth(token, user);
      set({ user });
    },
  };
});
