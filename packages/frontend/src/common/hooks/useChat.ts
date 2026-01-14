// Custom hook for chat management
import { useEffect, useState, useCallback, useRef } from 'react';
import { chatSocket } from '../../sockets/chatSocket';
import { TypingUser, UseChatOptions, Message } from '@/types/message-type';

export const useChat = ({ conversationId, recipientId, autoConnect = true, autoJoinRoom = true }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect socket & setup listeners
  useEffect(() => {
    if (!autoConnect) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found for socket connection');
      return;
    }

    chatSocket.connect(token);

    const handleConnect = () => {
      setIsConnected(true);
      if (autoJoinRoom && conversationId) {
        chatSocket.joinRoom(conversationId);
      }
    };

    const handleDisconnect = () => {
      console.log('Chat disconnected');
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      console.error('Chat error:', error);
      setIsConnected(false);
    };
    
    chatSocket.on('connect', handleConnect);
    chatSocket.on('disconnect', handleDisconnect);
    chatSocket.on('error', handleError);

    if (chatSocket.isConnected()) {
      setIsConnected(true);
      if (autoJoinRoom && conversationId) {
        chatSocket.joinRoom(conversationId);
      }
    }

  }, [autoConnect, autoJoinRoom, conversationId]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (data: { message: Message; conversationId: string | number }) => {
      if (String(data.conversationId) === String(conversationId)) {
        setMessages((prev) => {
          // Check if message already exists
          const exists = prev.find((m) => {
            if (data.message.id) return m.id === data.message.id;
            return false;
          });
          if (exists) return prev;
          
          // Add the new message
          return [...prev, data.message as Message];
        });
      }
    };

    chatSocket.on('newMessage', handleNewMessage);
    return () => {
      chatSocket.off('newMessage', handleNewMessage);
    };
  }, [conversationId]);

  // Listen for typing indicators
  useEffect(() => {
    const handleUserTyping = (data: { userId: string; username: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          if (prev.find((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, username: data.username }];
        });
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    chatSocket.on('userTyping', handleUserTyping);
    chatSocket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      chatSocket.off('userTyping', handleUserTyping);
      chatSocket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [conversationId]);

  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const handleUserStatusChanged = (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers((prev) => {
        if (data.status === 'online') {
          return [...new Set([...prev, data.userId])];
        } else {
          return prev.filter((id) => id !== data.userId);
        }
      });
    };

    chatSocket.on('onlineUsers', handleOnlineUsers);
    chatSocket.on('userStatusChanged', handleUserStatusChanged);
    chatSocket.getOnlineUsers();

    return () => {
      chatSocket.off('onlineUsers', handleOnlineUsers);
      chatSocket.off('userStatusChanged', handleUserStatusChanged);
    };
  }, []);

  useEffect(() => {
    const handleMessageRead = (data: { messageId: number; conversationId: string; readBy: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, status: 'read' as const } : msg
          )
        );
      }
    };

    chatSocket.on('messageRead', handleMessageRead);
    return () => {
      chatSocket.off('messageRead', handleMessageRead);
    };
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(
    (content: string, options?: { type?: 'text' | 'image'; attachments?: string[] }) => {
      if (!content.trim()) return;

      const tempId = `temp-${Date.now()}`;
      
      chatSocket.sendMessage({
        conversationId: conversationId ? conversationId : undefined,
        recipientId: recipientId,
        content: content.trim(),
        type: options?.type || 'text',
        attachments: options?.attachments,
        tempId,
      });

      const handleMessageSent = (data: { tempId: string; messageId: number }) => {
        console.log('✅ Message confirmation received:', data);
        if (data.tempId === tempId) {
          console.log('✨ Updating message with real ID');
          setMessages((prev) =>
            prev.map((msg) => 
              (msg.id === tempId) 
                ? { ...msg, id: data.messageId, status: 'delivered' as const }
                : msg
            )
          );
          chatSocket.off('messageSent', handleMessageSent);
        }
      };

      chatSocket.on('messageSent', handleMessageSent);
    },
    [conversationId, recipientId]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (conversationId) {
      chatSocket.startTyping(conversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (conversationId) {
        chatSocket.stopTyping(conversationId);
      }
    }, 3000);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (conversationId) {
      chatSocket.stopTyping(conversationId);
    }
  }, [conversationId]);

  const markAsRead = useCallback(
    (messageId: string) => {
      if (conversationId) {
        chatSocket.markAsRead(conversationId, messageId);
      }
    },
    [conversationId]
  );

  const markConversationAsRead = useCallback(() => {
    if (conversationId) {
      chatSocket.markConversationAsRead(conversationId);
    }
  }, [conversationId]);

  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.includes(userId);
    },
    [onlineUsers]
  );

  return {
    messages,
    typingUsers,
    onlineUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    markConversationAsRead,
    isUserOnline,
    setMessages,
  };
};

export default useChat;
