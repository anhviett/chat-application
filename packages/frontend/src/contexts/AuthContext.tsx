import {
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { UserType } from "@/types/user-type";
import { AuthContext } from "@/constants/auth-context.constant";
import { useAppDispatch } from "@/stores/hooks";
import {
  setCredentials,
  clearAuth,
  setAccessToken as setStoreAccessToken,
  initializeAuth,
} from "@/stores/slices/authSlice";


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
    dispatch(clearAuth()); // Clear Redux store
    window.location.href = "/login"; // redirect to login page
  };

  // Load from Local Storage on mount and verify token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Use cached data immediately - don't call API on page load
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log("✅ Loaded from cache");
      }

      // Initialize Redux store from localStorage
      dispatch(initializeAuth());

      // Set loading = false immediately
      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  const login = (token: string, refreshToken: string, userData: UserType) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setAccessToken(token);
    setUser(userData);

    // Save to Redux store
    dispatch(
      setCredentials({
        user: userData,
        accessToken: token,
        refreshToken: refreshToken,
      }),
    );
  };

  const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Handle mock refresh token
    if (refreshToken === "mock-refresh-token") {
      const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds
      const newMockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: 1, name: "test", exp: expirationTime }))}.mock-signature`;
      localStorage.setItem("accessToken", newMockToken);
      setAccessToken(newMockToken);
      dispatch(setStoreAccessToken(newMockToken)); // Update Redux store
      return newMockToken;
    }

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      // Update localStorage and state
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      dispatch(setStoreAccessToken(data.accessToken)); // Update Redux store

      // Optionally update refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, refreshAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}