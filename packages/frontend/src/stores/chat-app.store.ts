import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatUiReducer from "./slices/chatUiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatUi: chatUiReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
