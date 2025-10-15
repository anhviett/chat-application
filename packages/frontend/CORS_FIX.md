# 🔧 Quick Fix CORS Error (External API)

## ⚡ Nhanh chóng

### 1. Xác định API URL và cập nhật `.env`:
```env
# Ví dụ với DummyJSON
VITE_API_URL=https://dummyjson.com

# Hoặc API của bạn
VITE_API_URL=https://your-api.com/api/v1
```

### 2. Kiểm tra API có CORS không:
```powershell
curl -I https://your-api.com/endpoint `
  -H "Origin: http://localhost:5173"
```

**Cần có header:**
```
Access-Control-Allow-Origin: *
```

### 3. Restart Vite dev server:
```powershell
npm run dev
```

### 4. Test login:
- Mở http://localhost:5173/login
- Check Console (F12) for errors

---

## 📋 3 Solutions cho CORS với External API:

### ✅ **Solution 1: API có CORS** (Best)
→ Không cần làm gì, config hiện tại đã OK

### ⚠️ **Solution 2: API không CORS + Dev Mode**
→ Dùng Vite Proxy (xem `vite.config.ts`)

### 🔧 **Solution 3: API không CORS + Production**
→ Tạo Cloudflare Worker hoặc Vercel Edge Function

---

## 📝 Các thay đổi đã thực hiện:

✅ **axiosConfig.ts**
- Removed `withCredentials` (không cần cho public API)
- Timeout: 15s (phù hợp external API)
- Proper headers

✅ **.env**
- Template cho external API URL

✅ **vite.config.ts**
- Proxy config (commented out, uncomment nếu cần)

---

## 🐛 Nếu vẫn lỗi CORS:

### Option A: Dùng Vite Proxy (Dev only)
```typescript
// vite.config.ts - uncomment:
proxy: {
  '/api': {
    target: 'https://your-api.com',
    changeOrigin: true,
  }
}
```

### Option B: Dùng CORS Proxy
```env
# .env
VITE_API_URL=https://cors-anywhere.herokuapp.com/https://your-api.com
```

⚠️ Không khuyến nghị cho production

---

## 📚 Xem chi tiết:

- **[EXTERNAL_API_GUIDE.md](./EXTERNAL_API_GUIDE.md)** - Hướng dẫn đầy đủ
- **[CORS_SETUP.md](./CORS_SETUP.md)** - Setup backend (nếu tự host)

---

## ✅ Test với DummyJSON API:

```env
# .env
VITE_API_URL=https://dummyjson.com
```

```javascript
// Login credentials
username: emilys
password: emilyspass
```
