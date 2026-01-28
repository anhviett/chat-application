export type TypingContextType = {
  typingUsers: Record<number, boolean>;
  setUserTyping: (chatId: number, isTyping: boolean) => void;
};