# 🚀 MongoDB Setup Guide - Hướng Dẫn Tạo Collections

## 📌 Tổng Quan

Ứng dụng chat của bạn cần **4 collections chính**:

| Collection | Mục Đích |
|-----------|---------|
| **users** | Lưu thông tin người dùng |
| **interests** | Lưu các sở thích/hobbies |
| **conversations** | Lưu các cuộc trò chuyện (1-1, nhóm, channel) |
| **messages** | Lưu các tin nhắn |

---

## 🔧 Cách 1: Sử dụng MongoDB Compass (UI)

### Bước 1: Mở MongoDB Compass
```
1. Mở ứng dụng MongoDB Compass
2. Kết nối tới MongoDB server của bạn (mặc định: mongodb://localhost:27017)
```

### Bước 2: Tạo Database
```
1. Nhấp "Create Database"
2. Nhập tên: chat_app (hoặc tên của bạn)
3. Nhập collection name: users
4. Nhấp "Create Database"
```

### Bước 3: Tạo Collections
Lặp lại các bước sau cho từng collection:

#### ✅ Collection: users
```
Nhấp "+" → Create Collection → Tên: "users"
```

#### ✅ Collection: interests
```
Nhấp "+" → Create Collection → Tên: "interests"
```

#### ✅ Collection: conversations
```
Nhấp "+" → Create Collection → Tên: "conversations"
```

#### ✅ Collection: messages
```
Nhấp "+" → Create Collection → Tên: "messages"
```

---

## 🔧 Cách 2: Sử dụng MongoDB Shell (mongosh)

### Bước 1: Mở MongoDB Shell
```bash
# Trên Windows
mongosh

# Hoặc trực tiếp kết nối đến database
mongosh "mongodb://localhost:27017/chat_app"
```

### Bước 2: Chọn Database
```javascript
use chat_app
```

### Bước 3: Tạo Collections (chọn 1 trong 2 cách)

#### **Cách A: Tạo từng collection**
```javascript
// Tạo users collection
db.createCollection('users')

// Tạo interests collection
db.createCollection('interests')

// Tạo conversations collection
db.createCollection('conversations')

// Tạo messages collection
db.createCollection('messages')

// Xác nhận
show collections
```

#### **Cách B: Chạy file setup (Recommended)**
```bash
# Từ thư mục backend
mongosh "mongodb://localhost:27017/chat_app" mongodb-setup.js
```

---

## 🔧 Cách 3: Sử dụng MongoDB Atlas Cloud (Recommended)

### Bước 1: Tạo Cluster
```
1. Đăng nhập vào mongodb.com/atlas
2. Tạo free tier cluster
3. Ghi lại connection string
```

### Bước 2: Cập nhật `.env` file
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat_app?retryWrites=true&w=majority
```

### Bước 3: Tạo Collections bằng Compass hoặc mongosh
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/chat_app"
load('/path/to/mongodb-setup.js')
```

---

## 📊 Chi Tiết Các Collections

### 1️⃣ **users** Collection
```javascript
{
  _id: ObjectId,
  name: String,                    // Tên người dùng
  username: String,                // Username (unique)
  email: String,                   // Email (unique)
  password: String,                // Mật khẩu hash
  about: String,                   // Giới thiệu
  birthday: Date,                  // Ngày sinh
  height: Number,                  // Chiều cao
  weight: Number,                  // Cân nặng
  gender: String,                  // Giới tính (male/female/other)
  interests: [ObjectId],           // Ref to interests
  createdAt: Date,
  updatedAt: Date
}
```

### 2️⃣ **interests** Collection
```javascript
{
  _id: ObjectId,
  name: String                     // Tên sở thích (ví dụ: "Reading", "Gaming")
}
```

### 3️⃣ **conversations** Collection
```javascript
{
  _id: ObjectId,
  type: String,                    // "direct" | "group" | "channel"
  participants: [ObjectId],        // Danh sách User IDs
  createdBy: ObjectId,             // User ID người tạo
  name: String,                    // Tên (cho group/channel)
  avatar: String,                  // Avatar URL
  description: String,             // Mô tả
  lastMessage: ObjectId,           // Ref to message
  lastMessageAt: Date,             // Thời gian tin cuối
  participantMetadata: {           // Metadata cho mỗi user
    "userId": {
      unreadCount: Number,
      lastReadAt: Date,
      mutedUntil: Date
    }
  },
  admins: [ObjectId],              // Admin IDs
  isArchived: Boolean,
  settings: {                      // Settings tùy chỉnh
    allowMemberToInvite: Boolean,
    allowMemberToSendMedia: Boolean,
    requireApprovalToJoin: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4️⃣ **messages** Collection
```javascript
{
  _id: ObjectId,
  sender: ObjectId,                // User ID người gửi
  conversationId: ObjectId,        // Ref to conversation
  content: String,                 // Nội dung
  type: String,                    // "text" | "image" | "file" | "audio" | "video"
  status: String,                  // "sent" | "delivered" | "read"
  readBy: [                        // Người đã đọc
    {
      userId: ObjectId,
      readAt: Date
    }
  ],
  replyTo: ObjectId,               // Ref to message (reply)
  attachments: [String],           // URLs
  isDeleted: Boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Kiểm Tra Collections Đã Tạo

Chạy lệnh này trong mongosh:

```javascript
// Xem tất cả collections
show collections

// Xem số documents trong mỗi collection
db.users.countDocuments()
db.interests.countDocuments()
db.conversations.countDocuments()
db.messages.countDocuments()

// Xem schema của collection
db.users.findOne()
```

---

## ✅ Checklist Hoàn Thành

- [ ] Database `chat_app` đã tạo
- [ ] Collection `users` đã tạo
- [ ] Collection `interests` đã tạo
- [ ] Collection `conversations` đã tạo
- [ ] Collection `messages` đã tạo
- [ ] Indexes đã tạo (performance)
- [ ] MongoDB URI đã thêm vào `.env`
- [ ] Ứng dụng NestJS kết nối được MongoDB

---

## 🐛 Troubleshooting

### ❌ Lỗi: "Cannot create collection, database not found"
```bash
# Giải pháp: Chọn database trước
use chat_app
db.createCollection('users')
```

### ❌ Lỗi: "Connection refused"
```bash
# Kiểm tra MongoDB đang chạy
# Windows: Services > MongoDB > Start
# Linux: sudo systemctl start mongod
# Docker: docker-compose up -d mongo
```

### ❌ Lỗi: "Duplicate key error"
```javascript
// Xóa collection cũ
db.users.drop()

// Tạo lại
db.createCollection('users')
```

---

## 📚 Tài Liệu Thêm

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass Guide](https://docs.mongodb.com/compass/master/)
- [NestJS MongoDB](https://docs.nestjs.com/techniques/mongodb)

---

**Tạo bởi:** MongoDB Setup Guide  
**Cập nhật:** 2025-12-08
