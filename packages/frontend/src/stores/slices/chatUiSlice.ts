import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatThread } from "@/types/message-type";

interface ChatUiState {
  isInfoWindowOpen: boolean;
  chatThread?: ChatThread;
  isToggleInvite: boolean;
}

const initialState: ChatUiState = {
  isInfoWindowOpen: false,
  chatThread: undefined,
  isToggleInvite: false,
};

const chatUiSlice = createSlice({
  name: "chatUi",
  initialState,
  reducers: {
    toggleInfoWindow(state) {
      state.isInfoWindowOpen = !state.isInfoWindowOpen;
    },
    setInfoWindowOpen(state, action: PayloadAction<boolean>) {
      state.isInfoWindowOpen = action.payload;
    },
    setChatThread(state, action: PayloadAction<ChatThread | undefined>) {
      state.chatThread = action.payload;
    },
    backToList(state) {
      state.chatThread = undefined;
      state.isInfoWindowOpen = false;
    },
    toggleInvite(state) {
      state.isToggleInvite = !state.isToggleInvite;
    },
    setToggleInvite(state, action: PayloadAction<boolean>) {
      state.isToggleInvite = action.payload;
    },
  },
});

export const {
  toggleInfoWindow,
  setInfoWindowOpen,
  setChatThread,
  backToList,
  toggleInvite,
  setToggleInvite,
} = chatUiSlice.actions;
export default chatUiSlice.reducer;
