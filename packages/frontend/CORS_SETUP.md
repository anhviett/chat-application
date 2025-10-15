# 🔧 Fix CORS Error - Setup Guide

## 📋 Checklist để fix CORS

### ✅ Frontend (Đã setup xong)
- [x] Axios config với `withCredentials: true`
- [x] Headers: `Content-Type` và `Accept`
- [x] Vite proxy config cho development
- [x] Environment variables với correct API URL

---

## 🚀 Backend Setup (Cần làm ở Backend)

### 1️⃣ **Node.js/Express Backend**

```javascript
// backend/server.js hoặc backend/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // React dev server (nếu dùng)
  ],
  credentials: true,  // ⚠️ QUAN TRỌNG: Cho phép gửi cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));

// Middleware khác
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/api/v1/auth/login', (req, res) => {
  // Login logic
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2️⃣ **NestJS Backend**

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // React dev server
    ],
    credentials: true,  // ⚠️ QUAN TRỌNG
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
```

### 3️⃣ **FastAPI (Python) Backend**

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
    ],
    allow_credentials=True,  # ⚠️ QUAN TRỌNG
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    # Login logic
    pass
```

### 4️⃣ **Django Backend**

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ⚠️ Đặt đầu tiên
    'django.middleware.common.CommonMiddleware',
    # ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server
]

CORS_ALLOW_CREDENTIALS = True  # ⚠️ QUAN TRỌNG

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

---

## 🔍 Debugging CORS Issues

### Kiểm tra Network Tab trong Browser DevTools:

1. Mở Chrome DevTools → Network tab
2. Thử login
3. Kiểm tra request headers:
   ```
   Request Headers:
   ✅ Origin: http://localhost:5173
   ✅ Content-Type: application/json
   ```

4. Kiểm tra response headers:
   ```
   Response Headers:
   ✅ Access-Control-Allow-Origin: http://localhost:5173
   ✅ Access-Control-Allow-Credentials: true
   ```

### Nếu vẫn lỗi CORS:

#### ❌ Lỗi: "has been blocked by CORS policy"
**Giải pháp:**
- Đảm bảo backend có cấu hình CORS
- Kiểm tra origin trong backend có match với frontend URL không

#### ❌ Lỗi: "Response to preflight request doesn't pass"
**Giải pháp:**
- Thêm `OPTIONS` method vào backend
- Kiểm tra `Access-Control-Allow-Methods` header

#### ❌ Lỗi: "Credentials flag is 'true', but 'Access-Control-Allow-Credentials' header is ''"
**Giải pháp:**
- Thêm `credentials: true` trong CORS config ở backend
- Đảm bảo `withCredentials: true` ở frontend (đã có)

---

## 📝 Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Production (.env.production)
```env
VITE_API_URL=https://your-production-api.com/api/v1
```

---

## 🔄 Restart Required

Sau khi thay đổi config, cần restart:

### Frontend:
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

### Backend:
```bash
# Stop backend server
# Restart lại backend
```

---

## ✅ Test CORS

```bash
# Test từ terminal
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  -v
```

Nếu thấy header `Access-Control-Allow-Origin` trong response → CORS đã OK! 🎉

---

## 🆘 Still Having Issues?

1. Check backend logs for errors
2. Check browser console for detailed error messages
3. Verify API URL in `.env` file
4. Clear browser cache and localStorage
5. Try incognito/private mode

---

## 📚 References

- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Vite Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
