import { ChatThread } from "@/types/message-type";
export type LayoutContextType = {
  chatThread?: ChatThread;
  setChatThread: (chatThread: ChatThread) => void;
  handleToggleInfoWindow: () => void;
};
