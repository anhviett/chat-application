# 🌐 Working with External API - CORS Solutions

## 📋 Tình huống: Sử dụng API bên ngoài (không tự host backend)

Khi dùng External API, có 3 cách xử lý CORS:

---

## ✅ **Solution 1: API hỗ trợ CORS (Best case)**

Nếu API đã có CORS headers đúng → **Không cần làm gì thêm!**

### Kiểm tra API có hỗ trợ CORS:

```powershell
# Test với curl
curl -I https://api.example.com/endpoint `
  -H "Origin: http://localhost:5173"
```

**Response headers cần có:**

```
Access-Control-Allow-Origin: *
# hoặc
Access-Control-Allow-Origin: http://localhost:5173
```

### Config Frontend:

```typescript
// .env
VITE_API_URL=https://api.example.com

// axiosConfig.ts - Giữ nguyên, không cần thay đổi
```

✅ **APIs phổ biến hỗ trợ CORS:**

- https://dummyjson.com
- https://jsonplaceholder.typicode.com
- https://reqres.in
- https://api.github.com
- https://restcountries.com

---

## ⚠️ **Solution 2: API KHÔNG hỗ trợ CORS → Dùng Vite Proxy**

Nếu API không có CORS headers → Dùng Vite Proxy để bypass

### Setup:

#### 1. Config Vite Proxy:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://your-external-api.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Thêm headers nếu cần
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("Origin", "https://your-external-api.com");
          });
        },
      },
    },
  },
});
```

#### 2. Update .env:

```env
# Để trống hoặc dùng relative path
VITE_API_URL=/api
```

#### 3. Axios sẽ call:

```typescript
// Frontend call: /api/auth/login
// Vite proxy forward đến: https://your-external-api.com/auth/login
```

### ⚠️ Lưu ý:

- ✅ Chỉ hoạt động trong **development** (`npm run dev`)
- ❌ Không hoạt động trong **production** (build)

---

## 🔧 **Solution 3: Tạo CORS Proxy Server riêng**

Nếu cần deploy production và API không có CORS → Tạo proxy server

### Option A: Dùng CORS Anywhere (Free)

```typescript
// .env
VITE_API_URL=https://cors-anywhere.herokuapp.com/https://your-api.com
```

**⚠️ Không khuyến nghị cho production:**

- Rate limit
- Không ổn định
- Security risk

### Option B: Tạo Cloudflare Worker (Khuyến nghị)

#### 1. Tạo file `worker.js`:

```javascript
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const apiUrl = "https://your-external-api.com";

  // Forward request to actual API
  const apiRequest = new Request(apiUrl + url.pathname + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const response = await fetch(apiRequest);

  // Add CORS headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  newResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return newResponse;
}
```

#### 2. Deploy lên Cloudflare Workers:

```bash
npm install -g wrangler
wrangler publish
```

#### 3. Update .env:

```env
VITE_API_URL=https://your-proxy.workers.dev
```

### Option C: Vercel Edge Functions

```typescript
// api/proxy.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const apiUrl = `https://your-external-api.com/${path}`;

  const response = await fetch(apiUrl, {
    method: req.method,
    headers: req.headers as any,
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(data);
}
```

---

## 🎯 **Khuyến nghị theo từng trường hợp:**

| API Type                          | Solution                      | Reason                     |
| --------------------------------- | ----------------------------- | -------------------------- |
| **Public API hỗ trợ CORS**        | Solution 1                    | Đơn giản, không cần config |
| **Dev với API không CORS**        | Solution 2 (Vite Proxy)       | Nhanh, dễ setup            |
| **Production với API không CORS** | Solution 3B (Cloudflare)      | Free, fast, reliable       |
| **Team API riêng**                | Yêu cầu team backend bật CORS | Best practice              |

---

## 📝 Example với DummyJSON API (có CORS):

### 1. Update .env:

```env
VITE_API_URL=https://dummyjson.com
```

### 2. Update auth.ts:

```typescript
export const authApi = {
  login: async function (data: any) {
    const response = await api.request({
      url: "/auth/login", // → https://dummyjson.com/auth/login
      method: "POST",
      data: data,
    });
    return response.data;
  },
};
```

### 3. Test login:

```javascript
// Username: emilys
// Password: emilyspass
```

---

## 🐛 Troubleshooting:

### ❌ Lỗi: "Network Error"

**Nguyên nhân:** API không tồn tại hoặc sai URL

**Fix:**

```bash
# Test API bằng curl
curl https://your-api.com/endpoint
```

### ❌ Lỗi: "CORS policy"

**Nguyên nhân:** API không có CORS headers

**Fix:** Dùng Solution 2 (Vite Proxy) hoặc Solution 3 (CORS Proxy)

### ❌ Lỗi: "timeout of 15000ms exceeded"

**Nguyên nhân:** API chậm hoặc không response

**Fix:**

```typescript
// Tăng timeout
export const api = axios.create({
  timeout: 30000, // 30 giây
});
```

---

## ✅ Current Config (Updated):

```typescript
// ✅ .env
VITE_API_URL=https://dummyjson.com

// ✅ axiosConfig.ts
- Removed withCredentials (không cần cho public API)
- Timeout: 15s (đủ cho external API)
- Headers: Content-Type, Accept

// ✅ vite.config.ts
- Proxy: Commented out (không cần nếu API có CORS)
```

---

## 🚀 Next Steps:

1. **Xác định API URL của bạn**
2. **Test API có CORS không** (dùng curl)
3. **Update .env** với API URL
4. **Restart dev server**: `npm run dev`
5. **Test login**

---

## 📚 References:

- [Vite Proxy Config](https://vitejs.dev/config/server-options.html#server-proxy)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
