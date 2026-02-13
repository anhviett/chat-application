import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "@/types/user-type";

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSectionHeader: () => {},

    // Set user data after login
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserType;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // Update only access token (for token refresh)
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Update refresh token
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },

    // Update user info
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const storedToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        state.accessToken = storedToken;
        state.refreshToken = storedRefreshToken;
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setRefreshToken,
  setUser,
  setLoading,
  clearAuth,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
