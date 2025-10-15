# 🎯 Example: Setup với DummyJSON API

## 📖 DummyJSON là gì?

DummyJSON là một REST API miễn phí để test và prototype:
- ✅ Hỗ trợ CORS đầy đủ
- ✅ Có authentication endpoint
- ✅ Trả về fake data realistic
- 🌐 https://dummyjson.com

---

## 🚀 Quick Setup:

### 1. Update `.env`:
```env
VITE_API_URL=https://dummyjson.com
```

### 2. Update `auth.ts` (nếu cần):
```typescript
// src/api/auth.ts
import { api } from "./configs/axiosConfig"

export const authApi = {
    login: async function (data: any) {
        const response = await api.request({
            url: '/auth/login',
            method: "POST",
            data: {
                username: data.username,
                password: data.password,
                expiresInMins: 30, // optional, defaults to 60
            },
        })
        return response.data
    },
}
```

### 3. Test Login Credentials:

```javascript
// Demo users
Username: emilys
Password: emilyspass

Username: michaelw
Password: michaelwpass
```

---

## 📋 API Response Format:

### Successful Login:
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Failed Login:
```json
{
  "message": "Invalid credentials"
}
```

---

## 🔧 Update AuthContext để handle response:

```typescript
// src/contexts/AuthContext.tsx
const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setAccessToken(token);
    setUser(userData);
}

// src/layouts/Login.tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
        const data = await authApi.login(inputs);
        
        // DummyJSON response structure
        const user = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.image,
        };
        
        login(data.accessToken, data.refreshToken, user);
        navigate('/');
    } catch (error) {
        console.error("Login error:", error);
        alert('Invalid credentials');
    }
}
```

---

## 📝 Available Endpoints:

### Authentication:
```
POST /auth/login
POST /auth/refresh
GET  /auth/me (with Bearer token)
```

### Users:
```
GET  /users
GET  /users/{id}
GET  /users/search?q={query}
```

### Products:
```
GET  /products
GET  /products/{id}
GET  /products/search?q={query}
```

---

## ✅ Test Steps:

1. **Update .env**:
   ```env
   VITE_API_URL=https://dummyjson.com
   ```

2. **Restart dev server**:
   ```powershell
   npm run dev
   ```

3. **Open browser**:
   ```
   http://localhost:5173/login
   ```

4. **Login với**:
   ```
   Username: emilys
   Password: emilyspass
   ```

5. **Check Console**:
   - F12 → Console tab
   - Should see: "Login successful"
   - Check localStorage: accessToken, refreshToken, user

6. **Check Network tab**:
   - F12 → Network tab
   - Find POST request to `/auth/login`
   - Status: 200 OK
   - Response: JSON with tokens

---

## 🔐 Using Access Token:

```typescript
// Sau khi login, token tự động được thêm vào headers
// (axiosConfig.ts đã config interceptor)

// Example: Get current user
const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Example: Get all users
const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};
```

---

## 🐛 Common Issues:

### ❌ Error: "Invalid credentials"
**Fix:** Đảm bảo dùng đúng username/password từ list demo users

### ❌ Error: "Network Error"
**Fix:** Check internet connection, DummyJSON API có thể down

### ❌ Error: "token is invalid"
**Fix:** Token có thể expired, login lại

---

## 📚 More Demo Users:

```javascript
{ username: 'emilys', password: 'emilyspass' }
{ username: 'michaelw', password: 'michaelwpass' }
{ username: 'sophiab', password: 'sophiabpass' }
{ username: 'jamesd', password: 'jamesdpass' }
{ username: 'emmaj', password: 'emmajpass' }
```

---

## 🌐 Alternative APIs với CORS support:

### JSONPlaceholder:
```env
VITE_API_URL=https://jsonplaceholder.typicode.com
```

### ReqRes:
```env
VITE_API_URL=https://reqres.in/api
```

### FakeStoreAPI:
```env
VITE_API_URL=https://fakestoreapi.com
```

---

## 🎉 Next Steps:

1. ✅ Test login với DummyJSON
2. ✅ Implement protected routes
3. ✅ Add error handling
4. ✅ Implement logout
5. ✅ Add loading states

---

## 📖 Documentation:

- [DummyJSON Docs](https://dummyjson.com/docs)
- [DummyJSON Auth](https://dummyjson.com/docs/auth)
- [All Demo Users](https://dummyjson.com/users)
