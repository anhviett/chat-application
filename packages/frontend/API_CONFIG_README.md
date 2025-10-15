# 📚 API Configuration Guide

## 🎯 Tổng quan

Project này hỗ trợ 2 loại API:
1. **External API** (API bên ngoài) - Default
2. **Self-hosted Backend** (Tự host backend)

---

## 🌐 Option 1: External API (Khuyến nghị cho development)

### Quick Start:

```env
# .env
VITE_API_URL=https://dummyjson.com
```

### Docs:
- **[EXTERNAL_API_GUIDE.md](./EXTERNAL_API_GUIDE.md)** - Hướng dẫn đầy đủ
- **[DUMMYJSON_EXAMPLE.md](./DUMMYJSON_EXAMPLE.md)** - Ví dụ với DummyJSON
- **[CORS_FIX.md](./CORS_FIX.md)** - Quick fix CORS

### Test Login:
```
Username: emilys
Password: emilyspass
```

---

## 🏠 Option 2: Self-hosted Backend

### Quick Start:

```env
# .env
VITE_API_URL=http://localhost:3000/api/v1
```

### Docs:
- **[CORS_SETUP.md](./CORS_SETUP.md)** - Setup backend CORS

### Backend requirements:
- CORS enabled
- Endpoint: POST /api/v1/auth/login
- Response format:
  ```json
  {
    "accessToken": "...",
    "refreshToken": "...",
    "user": { ... }
  }
  ```

---

## 🚀 Getting Started:

### 1. Install dependencies:
```powershell
npm install
```

### 2. Setup environment:
```powershell
# Copy .env file và update API URL
VITE_API_URL=https://dummyjson.com
```

### 3. Start dev server:
```powershell
npm run dev
```

### 4. Open browser:
```
http://localhost:5173
```

---

## 📂 Config Files:

```
.env                        # Environment variables
src/api/configs/
  ├─ axiosConfig.ts        # Axios instance & interceptors
  └─ axiosClient.ts        # Request cancellation
src/api/
  ├─ auth.ts               # Auth API endpoints
  └─ user.ts               # User API endpoints
```

---

## 🔧 Current Configuration:

✅ **Axios Config:**
- Base URL: From `VITE_API_URL`
- Timeout: 15 seconds
- Headers: Content-Type, Accept
- Auto add Bearer token từ localStorage

✅ **Token Management:**
- AccessToken: localStorage key `accessToken`
- RefreshToken: localStorage key `refreshToken`
- Auto refresh khi 401 error

✅ **CORS:**
- Support external APIs with CORS
- Vite proxy available (comment trong vite.config.ts)

---

## 🐛 Troubleshooting:

### CORS Error?
→ Xem [CORS_FIX.md](./CORS_FIX.md)

### External API không có CORS?
→ Xem [EXTERNAL_API_GUIDE.md](./EXTERNAL_API_GUIDE.md) - Solution 2 & 3

### Muốn tự host backend?
→ Xem [CORS_SETUP.md](./CORS_SETUP.md)

### Test với demo API?
→ Xem [DUMMYJSON_EXAMPLE.md](./DUMMYJSON_EXAMPLE.md)

---

## 📝 Scripts:

```powershell
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🎓 Learn More:

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)
- [DummyJSON API](https://dummyjson.com/)
