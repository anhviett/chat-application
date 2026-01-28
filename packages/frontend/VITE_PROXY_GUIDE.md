# 🔧 CORS Fix với Vite Proxy - Chi tiết

## ❓ Tại sao cần Vite Proxy?

**CORS headers (Access-Control-Allow-Origin) chỉ có thể set từ BACKEND, KHÔNG thể thêm từ Frontend!**

```
Frontend (React) → Request → Backend API
                  ← Response (with CORS headers) ←

❌ KHÔNG THỂ: Frontend thêm CORS headers vào request
✅ CÓ THỂ: Backend thêm CORS headers vào response
```

**Vite Proxy giải quyết bằng cách:**

```
Frontend → Vite Dev Server → External API
        ↓ (same origin)   ↓ (server-to-server, no CORS)
     No CORS issue!
```

---

## ✅ Setup đã thực hiện:

### 1. **vite.config.ts** - Enable Proxy

```typescript
export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**Giải thích:**

- `'/api'`: Bắt tất cả requests bắt đầu với `/api`
- `target: 'https://dummyjson.com'`: Forward đến API này
- `changeOrigin: true`: Thay đổi origin header thành target
- `rewrite`: Xóa `/api` prefix trước khi forward

**Flow:**

```
Frontend call: /api/auth/login
      ↓
Vite proxy: https://dummyjson.com/auth/login
```

### 2. **.env** - Update API URL

```env
VITE_API_URL=/api
```

**Giải thích:**

- Dùng relative path `/api` thay vì full URL
- Vite sẽ tự động forward qua proxy

---

## 🚀 Cách hoạt động:

### Request flow:

```
1. Frontend code:
   api.post('/auth/login', { username, password })

2. Axios call:
   POST http://localhost:5174/api/auth/login

3. Vite Proxy intercept và forward:
   POST https://dummyjson.com/auth/login
   (remove /api prefix)

4. DummyJSON response:
   { accessToken: "...", refreshToken: "..." }

5. Vite Proxy forward response back:
   Frontend nhận response
```

---

## 🎯 Test Setup:

### 1. Stop và restart dev server:

```powershell
# Stop server (Ctrl+C)
npm run dev
```

### 2. Check console khi server start:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
➜  press h + enter to show help

✅ Proxy: /api → https://dummyjson.com
```

### 3. Test login:

```
http://localhost:5174/login

Username: emilys
Password: emilyspass
```

### 4. Check Network tab:

```
Request URL: http://localhost:5174/api/auth/login
Status: 200 OK
```

---

## 🐛 Troubleshooting:

### ❌ Lỗi: "Network error"

**Nguyên nhân:** Dev server chưa restart

**Fix:**

```powershell
# Stop dev server (Ctrl+C)
npm run dev
```

### ❌ Lỗi: "404 Not Found"

**Nguyên nhân:** Proxy chưa hoạt động

**Check:**

1. `vite.config.ts` có proxy config
2. `.env` có `VITE_API_URL=/api`
3. Dev server đã restart

### ❌ Lỗi: "ECONNREFUSED"

**Nguyên nhân:** Target API không accessible

**Check:**

```powershell
# Test DummyJSON có hoạt động không
curl https://dummyjson.com/auth/login
```

---

## ⚠️ Lưu ý quan trọng:

### ✅ Development (npm run dev):

- Proxy hoạt động ✅
- Không có CORS error ✅

### ❌ Production (npm run build):

- Proxy KHÔNG hoạt động ❌
- Cần config khác cho production

---

## 🌐 Alternative Solutions:

### Option 1: Dùng Vite Proxy (Current - Dev only)

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'https://dummyjson.com',
  }
}
```

### Option 2: CORS Anywhere (Dev + Prod)

```env
VITE_API_URL=https://cors-anywhere.herokuapp.com/https://dummyjson.com
```

⚠️ Không khuyến nghị cho production

### Option 3: Cloudflare Worker (Production)

```javascript
// worker.js
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const apiUrl = "https://dummyjson.com";

  const apiRequest = new Request(apiUrl + url.pathname, request);
  const response = await fetch(apiRequest);

  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");

  return newResponse;
}
```

### Option 4: Nginx Reverse Proxy (Production)

```nginx
location /api/ {
    proxy_pass https://dummyjson.com/;
    proxy_set_header Host dummyjson.com;
    proxy_set_header Origin https://dummyjson.com;

    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
}
```

---

## 📊 Comparison:

| Solution              | Dev | Prod | Setup  | Cost                |
| --------------------- | --- | ---- | ------ | ------------------- |
| **Vite Proxy**        | ✅  | ❌   | Easy   | Free                |
| **CORS Anywhere**     | ✅  | ⚠️   | Easy   | Free (limited)      |
| **Cloudflare Worker** | ✅  | ✅   | Medium | Free (100k req/day) |
| **Nginx Proxy**       | ✅  | ✅   | Hard   | Server cost         |

---

## ✅ Current Status:

```
✅ vite.config.ts - Proxy enabled
✅ .env - API URL set to /api
✅ axiosConfig.ts - withCredentials enabled
✅ Ready to test!
```

---

## 🚀 Next Steps:

1. **Restart dev server**: `npm run dev`
2. **Test login**: http://localhost:5174/login
3. **Check Network tab**: Request URL should be `/api/auth/login`
4. **Should work!** ✅

---

## 📚 References:

- [Vite Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [DummyJSON API](https://dummyjson.com/docs)
