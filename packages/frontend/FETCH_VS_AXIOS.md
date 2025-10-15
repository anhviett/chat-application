# 🔄 Fetch API vs Axios - So sánh

## 🎯 Tương đương giữa Fetch và Axios

### ✅ Fetch API (Native JavaScript):
```javascript
fetch('https://dummyjson.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'emilys',
    password: 'emilyspass',
    expiresInMins: 30,
  }),
  credentials: 'include' // ⬅️ Include cookies
})
.then(res => res.json())
.then(console.log);
```

### ✅ Axios (Library):
```javascript
import axios from 'axios';

axios.post('https://dummyjson.com/auth/login', {
  username: 'emilys',
  password: 'emilyspass',
  expiresInMins: 30,
}, {
  withCredentials: true, // ⬅️ Tương đương credentials: 'include'
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(res => console.log(res.data));
```

---

## 📊 Mapping Table:

| Feature | Fetch API | Axios |
|---------|-----------|-------|
| **Include cookies** | `credentials: 'include'` | `withCredentials: true` |
| **Request body** | `body: JSON.stringify(data)` | `data: data` (auto stringify) |
| **Response data** | `res.json()` then access | `res.data` (auto parse) |
| **Base URL** | Manual concatenation | `baseURL` config |
| **Timeout** | Use AbortController | `timeout` config |
| **Error handling** | Manual check `res.ok` | Auto reject on error status |
| **Request interceptor** | Manual wrapper | `interceptors.request` |
| **Response interceptor** | Manual wrapper | `interceptors.response` |

---

## 🔧 Trong Project này (Axios Config):

```typescript
// src/api/configs/axiosConfig.ts

export const api = axios.create({
    baseURL: 'https://dummyjson.com',
    withCredentials: true,  // ✅ = credentials: 'include' của fetch
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000,
})

// Auto add Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Sử dụng:
```typescript
// Thay vì fetch:
fetch('https://dummyjson.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
  credentials: 'include'
})

// Giờ dùng axios:
api.post('/auth/login', {
  username: 'emilys',
  password: 'emilyspass'
})
// ✅ baseURL tự động thêm
// ✅ headers tự động thêm
// ✅ withCredentials tự động thêm
// ✅ data tự động JSON.stringify
// ✅ response tự động parse JSON
```

---

## 🎯 Ví dụ đầy đủ:

### Fetch API:
```javascript
// Login
fetch('https://dummyjson.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'emilys',
    password: 'emilyspass',
  }),
  credentials: 'include'
})
.then(res => {
  if (!res.ok) throw new Error('Login failed');
  return res.json();
})
.then(data => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
})
.catch(err => console.error(err));

// Get current user (with token)
const token = localStorage.getItem('accessToken');
fetch('https://dummyjson.com/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
.then(res => res.json())
.then(console.log);
```

### Axios (Project này):
```typescript
// Login
import { authApi } from '@/api/auth';

authApi.login({
  username: 'emilys',
  password: 'emilyspass'
})
.then(data => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
})
.catch(err => console.error(err));

// Get current user (token tự động thêm từ interceptor)
import { api } from '@/api/configs/axiosConfig';

api.get('/auth/me')
.then(res => console.log(res.data));
```

---

## ⚠️ Common Mistakes:

### ❌ SAI: Dùng `credentials` trong Axios
```typescript
axios.create({
  credentials: 'include', // ❌ Không tồn tại trong Axios
});
```

### ✅ ĐÚNG: Dùng `withCredentials`
```typescript
axios.create({
  withCredentials: true, // ✅ Đúng syntax
});
```

---

### ❌ SAI: Dùng `body` trong Axios
```typescript
axios.post(url, {
  body: JSON.stringify(data), // ❌ Sai
});
```

### ✅ ĐÚNG: Truyền data trực tiếp
```typescript
axios.post(url, data); // ✅ Axios tự stringify
```

---

## 🔍 Response Structure:

### Fetch API:
```javascript
fetch(url).then(res => {
  console.log(res.status);      // 200
  console.log(res.statusText);  // "OK"
  console.log(res.headers);     // Headers object
  return res.json();            // Parse JSON manually
}).then(data => {
  console.log(data);            // Actual data
});
```

### Axios:
```javascript
axios.get(url).then(res => {
  console.log(res.status);      // 200
  console.log(res.statusText);  // "OK"
  console.log(res.headers);     // Headers object
  console.log(res.data);        // ✅ Already parsed JSON
});
```

---

## 🎓 Khi nào dùng cái nào?

### Dùng Fetch API khi:
- ✅ Simple requests, không cần config phức tạp
- ✅ Không muốn thêm dependencies
- ✅ Modern browsers only

### Dùng Axios khi:
- ✅ Cần interceptors
- ✅ Cần auto retry
- ✅ Cần request cancellation
- ✅ Cần base URL config
- ✅ Cần timeout
- ✅ Better error handling
- ✅ Support older browsers

→ **Project này dùng Axios** vì cần tất cả features trên! 🎯

---

## 📚 References:

- [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [DummyJSON Docs](https://dummyjson.com/docs)
