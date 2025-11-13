# Real-Time Chat Implementation Guide

## Overview

This is a modern, production-ready real-time chat system built with NestJS and Socket.IO. It includes:

- ✅ Real-time messaging with Socket.IO
- ✅ JWT authentication for WebSocket connections
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Read receipts
- ✅ Message history with pagination
- ✅ Direct messages and group chats
- ✅ Unread message counters
- ✅ Room management
- ✅ MongoDB with Mongoose for persistence
- ✅ Comprehensive error handling
- ✅ TypeScript with DTOs and validation

## Architecture

### Backend Components

```
chats/
├── chat.gateway.ts          # WebSocket event handlers
├── chat.service.ts          # Business logic & database operations
├── chat.controller.ts       # REST API endpoints
├── chat.module.ts           # Module configuration
├── dto/
│   └── chat.dto.ts          # Data transfer objects with validation
├── schemas/
│   ├── message.schema.ts    # Message model
│   └── conversation.schema.ts # Conversation model
└── guards/
    └── ws-jwt.guard.ts      # WebSocket JWT authentication
```

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `createConversation` | `CreateConversationDto` | Create new conversation |
| `joinRoom` | `{ conversationId: string }` | Join conversation room |
| `sendMessage` | `SendMessageDto` | Send a message |
| `typing` | `{ conversationId: string }` | User started typing |
| `stopTyping` | `{ conversationId: string }` | User stopped typing |
| `markAsRead` | `{ conversationId, messageId }` | Mark message as read |
| `markConversationAsRead` | `{ conversationId }` | Mark all messages read |
| `getOnlineUsers` | - | Get list of online users |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `onlineUsers` | `string[]` | List of online user IDs |
| `conversationCreated` | `Conversation` | New conversation created |
| `newMessage` | `{ message, conversationId }` | New message received |
| `messageSent` | `{ tempId, messageId }` | Message delivery confirmation |
| `userTyping` | `{ userId, conversationId, username }` | User is typing |
| `userStoppedTyping` | `{ userId, conversationId }` | User stopped typing |
| `messageRead` | `{ messageId, conversationId, readBy, readAt }` | Message read receipt |
| `conversationRead` | `{ conversationId, readBy, readAt }` | All messages read |
| `userStatusChanged` | `{ userId, status, timestamp }` | User online/offline |

## REST API Endpoints

All endpoints require JWT authentication (except where noted).

```
POST   /chats/conversations              - Create conversation
GET    /chats/conversations              - Get user's conversations
GET    /chats/conversations/:id          - Get conversation details
GET    /chats/conversations/:id/messages - Get messages (paginated)
POST   /chats/conversations/:id/read     - Mark conversation as read
DELETE /chats/messages/:id               - Delete message
POST   /chats/conversations/:id/participants - Add participants
DELETE /chats/conversations/:id/participants/:userId - Remove participant
POST   /chats/conversations/:id/leave    - Leave conversation
```

## Client Implementation Examples

### React/TypeScript with Socket.IO Client

#### 1. Install Dependencies

\`\`\`bash
npm install socket.io-client
\`\`\`

#### 2. Create Socket Context

\`\`\`typescript
// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get JWT token from localStorage or your auth context
    const token = localStorage.getItem('token');
    
    if (!token) return;

    // Connect to socket with JWT authentication
    const newSocket = io('http://localhost:3000/chat', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
\`\`\`

#### 3. Chat Hook

\`\`\`typescript
// src/hooks/useChat.ts
import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    username: string;
  };
  content: string;
  conversationId: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

interface TypingUser {
  userId: string;
  username: string;
}

export const useChat = (conversationId: string) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the conversation room
    socket.emit('joinRoom', { conversationId });

    // Listen for new messages
    socket.on('newMessage', ({ message, conversationId: convId }) => {
      if (convId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for typing indicators
    socket.on('userTyping', ({ userId, username, conversationId: convId }) => {
      if (convId === conversationId) {
        setTypingUsers((prev) => {
          if (prev.find((u) => u.userId === userId)) return prev;
          return [...prev, { userId, username }];
        });
      }
    });

    socket.on('userStoppedTyping', ({ userId, conversationId: convId }) => {
      if (convId === conversationId) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      }
    });

    // Listen for read receipts
    socket.on('messageRead', ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, status: 'read' as const }
            : msg
        )
      );
    });

    // Listen for online users
    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('userStatusChanged', ({ userId, status }) => {
      setOnlineUsers((prev) =>
        status === 'online'
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId)
      );
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('messageRead');
      socket.off('onlineUsers');
      socket.off('userStatusChanged');
    };
  }, [socket, conversationId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !content.trim()) return;

      const tempId = Date.now().toString();
      
      socket.emit('sendMessage', {
        conversationId,
        content: content.trim(),
        type: 'text',
        tempId,
      });

      // Optimistic update
      // setMessages((prev) => [...prev, optimisticMessage]);
    },
    [socket, conversationId]
  );

  const startTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('typing', { conversationId });
  }, [socket, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('stopTyping', { conversationId });
  }, [socket, conversationId]);

  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socket) return;
      socket.emit('markAsRead', { conversationId, messageId });
    },
    [socket, conversationId]
  );

  return {
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    isConnected,
  };
};
\`\`\`

#### 4. Chat Component Example

\`\`\`typescript
// src/components/ChatRoom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';

interface ChatRoomProps {
  conversationId: string;
  currentUserId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ conversationId, currentUserId }) => {
  const {
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    isConnected,
  } = useChat(conversationId);

  const [inputValue, setInputValue] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Start typing indicator
    startTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(inputValue);
    setInputValue('');
    stopTyping();
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Chat Room</h2>
        <div className="connection-status">
          {isConnected ? (
            <span className="status-online">🟢 Connected</span>
          ) : (
            <span className="status-offline">🔴 Disconnected</span>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={\`message \${
              message.sender._id === currentUserId ? 'message-sent' : 'message-received'
            }\`}
          >
            <div className="message-sender">{message.sender.name}</div>
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
              {message.sender._id === currentUserId && (
                <span className="message-status">
                  {message.status === 'read' && ' ✓✓'}
                  {message.status === 'delivered' && ' ✓'}
                  {message.status === 'sent' && ' ⏱'}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.map((u) => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" disabled={!isConnected || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};
\`\`\`

## Environment Variables

Create a \`.env\` file in your backend:

\`\`\`env
MONGO_URI=mongodb://localhost:27017/chat
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:5173
PORT=3000
\`\`\`

## Running the Application

### Backend

\`\`\`bash
cd packages/backend
npm install
npm run start:dev
\`\`\`

### Frontend

\`\`\`bash
cd packages/frontend
npm install
npm run dev
\`\`\`

## Production Considerations

### 1. Redis Adapter for Horizontal Scaling

For production with multiple server instances, use Redis adapter:

\`\`\`bash
npm install @socket.io/redis-adapter redis
\`\`\`

\`\`\`typescript
// chat.gateway.ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

async afterInit(server: Server) {
  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  server.adapter(createAdapter(pubClient, subClient));
}
\`\`\`

### 2. Rate Limiting

Add rate limiting to prevent spam:

\`\`\`bash
npm install @nestjs/throttler
\`\`\`

### 3. Message Queue

For heavy loads, use Bull for message processing:

\`\`\`bash
npm install @nestjs/bull bull
\`\`\`

### 4. File Upload

Integrate with AWS S3 or similar for media messages.

### 5. Push Notifications

Implement Firebase Cloud Messaging for offline notifications.

## Testing

### Test Socket Connection

\`\`\`typescript
// test-socket.ts
import { io } from 'socket.io-client';

const token = 'your-jwt-token';

const socket = io('http://localhost:3000/chat', {
  auth: { token },
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  // Join a room
  socket.emit('joinRoom', { conversationId: 'test-conv-id' });
  
  // Send a message
  socket.emit('sendMessage', {
    conversationId: 'test-conv-id',
    content: 'Hello World!',
    type: 'text',
  });
});

socket.on('newMessage', (data) => {
  console.log('New message:', data);
});
\`\`\`

## Security Best Practices

1. ✅ Always validate and sanitize user input
2. ✅ Use JWT with short expiration times
3. ✅ Implement rate limiting
4. ✅ Validate conversation membership before operations
5. ✅ Use HTTPS in production
6. ✅ Sanitize message content to prevent XSS
7. ✅ Implement proper CORS configuration
8. ✅ Log and monitor suspicious activities

## Performance Tips

1. **Pagination**: Load messages in chunks (50-100 at a time)
2. **Debounce**: Debounce typing indicators (2-3 seconds)
3. **Indexing**: Ensure proper MongoDB indexes on frequently queried fields
4. **Caching**: Cache conversation lists with Redis
5. **Compression**: Enable WebSocket compression
6. **CDN**: Serve media files from CDN

## Monitoring & Debugging

Enable detailed logging:

\`\`\`typescript
// main.ts
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
});
\`\`\`

Monitor socket connections:

\`\`\`typescript
server.on('connection', (socket) => {
  console.log('Total connections:', server.sockets.sockets.size);
});
\`\`\`

## Troubleshooting

### Connection Issues

- Check CORS configuration
- Verify JWT token is being sent
- Check network/firewall settings
- Enable Socket.IO debug mode: \`localStorage.debug = 'socket.io-client:*'\`

### Messages Not Delivering

- Verify user is in the conversation room
- Check conversation membership
- Verify MongoDB connection
- Check server logs for errors

## License

MIT
