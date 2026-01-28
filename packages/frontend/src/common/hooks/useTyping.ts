import { useContext, } from "react";
import { TypingContext } from "@/constants/typing-context.constant";

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error("useTyping must be used within TypingProvider");
  }
  return context;
};