import React, { useState, useCallback } from "react";
import { TypingContext } from "@/constants/typing-context.constant";

export const TypingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

  const setUserTyping = useCallback((chatId: number, isTyping: boolean) => {
    setTypingUsers((prev) => ({
      ...prev,
      [chatId]: isTyping,
    }));
  }, []);

  return (
    <TypingContext.Provider value={{ typingUsers, setUserTyping }}>
      {children}
    </TypingContext.Provider>
  );
};

