import React, { createContext, useContext, useState, useCallback } from 'react';

type TypingContextType = {
  typingUsers: Record<number, boolean>; // { chatId: isTyping }
  setUserTyping: (chatId: number, isTyping: boolean) => void;
};

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

  const setUserTyping = useCallback((chatId: number, isTyping: boolean) => {
    setTypingUsers(prev => ({
      ...prev,
      [chatId]: isTyping
    }));
  }, []);

  return (
    <TypingContext.Provider value={{ typingUsers, setUserTyping }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTyping must be used within TypingProvider');
  }
  return context;
};
