import { MessageType } from "@/enums/sendMessageType.enum";

export interface SendMessage {
  conversationId: string;
  content: string;
  type: MessageType;
}

export interface Message {
  id: string | number;
  sender?: { id: number; name: string; username: string; avatar?: string };
  content: string;
  conversationId?: string | number;
  type: "text" | "image" | "file" | "audio" | "video";
  status: "sent" | "delivered" | "read";
  createdAt: string;
}

export interface ChatThread {
  _id?: string;
  name: string;
  recipientId: string; // User ID para tạo direct message
  conversationId?: string;
}

// Interface cho TypingUser - mô tả user đang gõ
export interface TypingUser {
  userId: string; // ID của user đang gõ
  username: string; // Username để hiển thị "X đang gõ..."
}

export interface UseChatOptions {
  conversationId?: string; // ID của conversation (optional nếu chưa tạo)
  recipientId?: string; // User ID để tạo direct message nếu conversation chưa tồn tại
  autoConnect?: boolean; // Có tự động kết nối socket không (default: true)
  autoJoinRoom?: boolean; // Có tự động join room không (default: true)
}

export interface SendMessagePayload {
  content: string;
  type: "text" | "image";
  attachments?: string[];
  tempId: string;
  conversationId?: string | number;
  recipientId?: string;
  typeConversation?: string;
}