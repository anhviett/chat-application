
import { createContext } from "react";
import { TypingContextType } from "@/types/typing-context";

export const TypingContext = createContext<TypingContextType | undefined>(undefined);