// Frontend Socket Client for Chat Application
// Location: packages/frontend/src/sockets/chatSocket.ts

import { io, Socket } from 'socket.io-client';
import { SendMessage } from '@/types/message-type';

interface Conversation {
  _id: string;
  type: 'direct' | 'group' | 'channel';
  participants: any[];
  name?: string;
  avatar?: string;
  lastMessage?: SendMessage;
  lastMessageAt?: string;
}

interface ChatSocketEvents {
  // Server → Client events
  onlineUsers: (users: string[]) => void;
  conversationCreated: (conversation: Conversation) => void;
  newMessage: (data: { message: SendMessage; conversationId: string }) => void;
  messageSent: (data: { tempId: string; messageId: string }) => void;
  userTyping: (data: { userId: string; conversationId: string; username: string }) => void;
  userStoppedTyping: (data: { userId: string; conversationId: string }) => void;
  messageRead: (data: { messageId: string; conversationId: string; readBy: string; readAt: string }) => void;
  conversationRead: (data: { conversationId: string; readBy: string; readAt: string }) => void;
  userStatusChanged: (data: { userId: string; status: 'online' | 'offline'; timestamp: string }) => void;
}

class ChatSocket {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    this.socket = io(`${BACKEND_URL}`, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.emit('connect', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.emit('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('error', error);
    });

    // Chat events
    this.socket.on('onlineUsers', (users: string[]) => {
      this.emit('onlineUsers', users);
    });

    this.socket.on('conversationCreated', (conversation: Conversation) => {
      this.emit('conversationCreated', conversation);
    });

    this.socket.on('newMessage', (data: { message: SendMessage; conversationId: string }) => {
      this.emit('newMessage', data);
    });

    this.socket.on('messageSent', (data: { tempId: string; messageId: string }) => {
      this.emit('messageSent', data);
    });

    this.socket.on('userTyping', (data: any) => {
      this.emit('userTyping', data);
    });

    this.socket.on('userStoppedTyping', (data: any) => {
      this.emit('userStoppedTyping', data);
    });

    this.socket.on('messageRead', (data: any) => {
      this.emit('messageRead', data);
    });

    this.socket.on('conversationRead', (data: any) => {
      this.emit('conversationRead', data);
    });

    this.socket.on('userStatusChanged', (data: any) => {
      this.emit('userStatusChanged', data);
    });
  }

  // Event emitter pattern
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Client → Server methods
  createConversation(data: {
    type: 'direct' | 'group' | 'channel';
    participants: string[];
    name?: string;
    description?: string;
  }) {
    return this.socket?.emit('createConversation', data);
  }

  joinRoom(conversationId: string) {
    return this.socket?.emit('joinRoom', { conversationId });
  }

  sendMessage(data: {
    conversationId?: string;
    recipientId?: string;   // User ID để tạo direct message
    content: string;
    type?: 'text' | 'image' | 'file' | 'audio' | 'video';
    attachments?: string[];
    tempId?: string;
  }) {
    const messageData = {
      ...data,
      type: data.type || 'text',
      tempId: data.tempId || Date.now().toString(),
    };
    return this.socket?.emit('sendMessage', messageData);
  }

  startTyping(conversationId: string) {
    return this.socket?.emit('typing', { conversationId });
  }

  stopTyping(conversationId: string) {
    return this.socket?.emit('stopTyping', { conversationId });
  }

  markAsRead(conversationId: string, messageId: string) {
    return this.socket?.emit('markAsRead', { conversationId, messageId });
  }

  markConversationAsRead(conversationId: string) {
    return this.socket?.emit('markConversationAsRead', { conversationId });
  }

  getOnlineUsers() {
    return this.socket?.emit('getOnlineUsers');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const chatSocket = new ChatSocket();

export default chatSocket;
