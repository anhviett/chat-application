# 🚀 Chat Application - Quick Start Guide

## Tổng Quan

Hệ thống chat real-time hiện đại được xây dựng với:
- **Backend**: NestJS + Socket.IO + MongoDB + Mongoose
- **Frontend**: React + TypeScript + Socket.IO Client
- **Features**: Tin nhắn real-time, typing indicators, online status, read receipts, group chat

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+ (local hoặc MongoDB Atlas)
- npm hoặc yarn

## 🔧 Cài Đặt Backend

### 1. Cài dependencies

\`\`\`bash
cd packages/backend
npm install
\`\`\`

### 2. Tạo file .env

\`\`\`bash
# packages/backend/.env
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
PORT=3000
\`\`\`

### 3. Chạy backend

\`\`\`bash
# Development mode với hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
\`\`\`

Backend sẽ chạy tại: **http://localhost:3000**

## 🎨 Cài Đặt Frontend

### 1. Cài dependencies

\`\`\`bash
cd packages/frontend
npm install socket.io-client
\`\`\`

### 2. Tạo file .env

\`\`\`bash
# packages/frontend/.env
VITE_BACKEND_URL=http://localhost:3000
\`\`\`

### 3. Chạy frontend

\`\`\`bash
npm run dev
\`\`\`

Frontend sẽ chạy tại: **http://localhost:5173**

## 📚 Sử Dụng

### Backend API Endpoints

#### REST API

\`\`\`
POST   /chats/conversations              - Tạo conversation mới
GET    /chats/conversations              - Lấy danh sách conversations
GET    /chats/conversations/:id          - Chi tiết conversation
GET    /chats/conversations/:id/messages - Lấy tin nhắn (phân trang)
POST   /chats/conversations/:id/read     - Đánh dấu đã đọc
DELETE /chats/messages/:id               - Xóa tin nhắn
\`\`\`

#### WebSocket Events

**Client gửi lên Server:**

| Event | Payload | Mô tả |
|-------|---------|-------|
| \`createConversation\` | \`{ type, participants, name }\` | Tạo conversation |
| \`joinRoom\` | \`{ conversationId }\` | Join vào phòng chat |
| \`sendMessage\` | \`{ conversationId, content }\` | Gửi tin nhắn |
| \`typing\` | \`{ conversationId }\` | Đang gõ... |
| \`stopTyping\` | \`{ conversationId }\` | Dừng gõ |
| \`markAsRead\` | \`{ conversationId, messageId }\` | Đánh dấu đã đọc |

**Server gửi xuống Client:**

| Event | Payload | Mô tả |
|-------|---------|-------|
| \`onlineUsers\` | \`string[]\` | Danh sách user online |
| \`newMessage\` | \`{ message, conversationId }\` | Tin nhắn mới |
| \`userTyping\` | \`{ userId, username, conversationId }\` | User đang gõ |
| \`userStoppedTyping\` | \`{ userId, conversationId }\` | User dừng gõ |
| \`messageRead\` | \`{ messageId, readBy, readAt }\` | Tin nhắn đã đọc |
| \`userStatusChanged\` | \`{ userId, status }\` | Thay đổi trạng thái |

### Frontend Usage

#### 1. Kết nối Socket

\`\`\`typescript
import { chatSocket } from './sockets/chatSocket';

// Kết nối với JWT token
const token = localStorage.getItem('token');
chatSocket.connect(token);
\`\`\`

#### 2. Sử dụng React Hook

\`\`\`typescript
import { useChat } from './hooks/useChat';

function ChatRoom({ conversationId }) {
  const {
    messages,
    typingUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChat({ conversationId });

  const handleSendMessage = () => {
    sendMessage('Hello World!');
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg._id}>{msg.content}</div>
      ))}
      
      {typingUsers.length > 0 && (
        <div>{typingUsers[0].username} đang gõ...</div>
      )}
      
      <input 
        onChange={() => startTyping()}
        onBlur={() => stopTyping()}
      />
      <button onClick={handleSendMessage}>Gửi</button>
    </div>
  );
}
\`\`\`

## 🏗️ Kiến Trúc

### Database Schema

#### Message Schema
\`\`\`typescript
{
  sender: ObjectId,           // User ID
  conversationId: ObjectId,   // Conversation ID
  content: string,            // Nội dung
  type: 'text' | 'image' | 'file',
  status: 'sent' | 'delivered' | 'read',
  readBy: [{ userId, readAt }],
  replyTo: ObjectId,          // Reply to message
  attachments: string[],
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### Conversation Schema
\`\`\`typescript
{
  type: 'direct' | 'group' | 'channel',
  participants: [ObjectId],   // Array of User IDs
  name: string,               // Tên group (optional)
  avatar: string,
  lastMessage: ObjectId,
  lastMessageAt: Date,
  participantMetadata: Map<userId, {
    unreadCount: number,
    lastReadAt: Date,
    mutedUntil: Date
  }>,
  admins: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Workflow

1. **User kết nối:**
   - Client gửi JWT token khi connect
   - Server xác thực và join user vào rooms của họ
   - Broadcast trạng thái online

2. **Gửi tin nhắn:**
   - Client emit \`sendMessage\` với content
   - Server validate, lưu DB, broadcast tới room
   - Server gửi confirmation về client

3. **Typing indicator:**
   - Client emit \`typing\` khi user gõ
   - Server broadcast tới người khác trong room
   - Auto-stop sau 3 giây không activity

4. **Read receipts:**
   - Client emit \`markAsRead\` khi xem tin nhắn
   - Server update DB và broadcast
   - UI hiện ✓✓ cho người gửi

## 🔒 Authentication

### JWT Token Format

\`\`\`typescript
{
  sub: string,      // User ID
  email: string,
  username: string,
  iat: number,
  exp: number
}
\`\`\`

### Socket Authentication

Socket.IO sẽ tự động gửi token qua:
\`\`\`typescript
io('http://localhost:3000/chat', {
  auth: { token: 'your-jwt-token' }
})
\`\`\`

## 🚀 Production Deployment

### 1. Environment Variables

\`\`\`bash
# Production .env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat
JWT_SECRET=super-secure-random-string-256-bits
FRONTEND_URL=https://your-domain.com
PORT=3000
\`\`\`

### 2. Build

\`\`\`bash
# Backend
cd packages/backend
npm run build
npm run start:prod

# Frontend
cd packages/frontend
npm run build
# Deploy dist/ folder to CDN/hosting
\`\`\`

### 3. Scale với Redis (Optional)

Để scale horizontally với nhiều server instances:

\`\`\`bash
npm install @socket.io/redis-adapter redis
\`\`\`

\`\`\`typescript
// chat.gateway.ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

async afterInit(server: Server) {
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);
  server.adapter(createAdapter(pubClient, subClient));
}
\`\`\`

## 📊 Monitoring & Performance

### Logging

\`\`\`typescript
// main.ts
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log'],
});
\`\`\`

### Metrics

- Số lượng connections: \`server.sockets.sockets.size\`
- Số lượng rooms: \`server.sockets.adapter.rooms.size\`
- Message rate: Track với middleware

### Database Indexes

Đã được tạo sẵn trong schemas:
- \`conversationId + createdAt\` cho messages
- \`participants\` cho conversations
- \`lastMessageAt\` cho sorting conversations

## 🐛 Troubleshooting

### Connection Failed

1. Kiểm tra CORS trong backend
2. Verify JWT token còn valid
3. Check network/firewall
4. Enable debug: \`localStorage.debug = 'socket.io-client:*'\`

### Messages không gửi được

1. Verify user đã join room
2. Check MongoDB connection
3. Xem logs backend
4. Verify conversation membership

### Performance Issues

1. Enable compression cho WebSocket
2. Implement pagination cho messages
3. Add Redis caching cho conversations
4. Optimize MongoDB indexes

## 📖 Tài Liệu Chi Tiết

Xem file \`CHAT_IMPLEMENTATION_GUIDE.md\` để biết thêm chi tiết về:
- React components examples
- Advanced features
- Security best practices
- Testing strategies
- Production optimization

## 🤝 Support

Nếu gặp vấn đề, hãy:
1. Check logs ở backend và frontend
2. Verify MongoDB connection
3. Test với Postman/curl cho REST API
4. Test socket connection với debug mode
5. Kiểm tra firewall/network settings

## 📝 License

MIT
