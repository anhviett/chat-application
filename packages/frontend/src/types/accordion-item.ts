import { ReactNode } from "react";

export interface AccordionItem {
  icon?: ReactNode; // ✅ Có thể là string hoặc JSX element
  title: string | ReactNode; // ✅ Có thể custom title
  content?: string | ReactNode; // ✅ Có thể custom content
  children?: ReactNode; // ✅ Giống như slot default trong Vue
  isOpen: boolean;
  onClick: () => void;
}
