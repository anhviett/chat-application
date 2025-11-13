# 📚 HƯỚNG DẪN HỌC VÀ HIỂU CODE - Chat Application

## 🎯 Mục Đích Document Này

Document này giải thích CHI TIẾT các khái niệm, cú pháp, và lý do tại sao code được viết như vậy. Đọc kỹ để hiểu thật sâu, không chỉ copy-paste!

---

## 📖 MỤC LỤC

1. [Kiến Thức Cơ Bản Cần Có](#kiến-thức-cơ-bản)
2. [TypeScript Concepts](#typescript-concepts)
3. [NestJS Decorators](#nestjs-decorators)
4. [React Hooks](#react-hooks)
5. [Socket.IO Patterns](#socketio-patterns)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)

---

## 🔰 Kiến Thức Cơ Bản

### 1. **Promise và Async/Await**

```typescript
// CÁCH CŨ: Promise với .then()
function oldWay() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

// CÁCH MỚI: Async/Await (dễ đọc hơn)
async function newWay() {
  try {
    const response = await fetch('/api/data'); // Chờ fetch xong
    const data = await response.json();        // Chờ parse JSON xong
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

**Giải thích:**
- `async` đánh dấu function là asynchronous (bất đồng bộ)
- `await` chờ Promise resolve trước khi chạy dòng tiếp theo
- Dễ đọc hơn so với callback hell

### 2. **Arrow Functions**

```typescript
// Function thường
function add(a, b) {
  return a + b;
}

// Arrow function (cú pháp ngắn gọn)
const add = (a, b) => {
  return a + b;
};

// Arrow function với implicit return (nếu chỉ 1 dòng)
const add = (a, b) => a + b;

// Arrow function không có tham số
const sayHi = () => console.log('Hi!');

// Arrow function với 1 tham số (có thể bỏ dấu ngoặc)
const double = x => x * 2;
```

**Khi nào dùng:**
- Arrow function KHÔNG có `this` riêng (dùng `this` của scope cha)
- Dùng cho callbacks, array methods (map, filter, forEach)
- Ngắn gọn hơn function thường

### 3. **Destructuring**

```typescript
// Object destructuring
const user = { name: 'John', age: 30, email: 'john@example.com' };

// Lấy ra các properties cụ thể
const { name, age } = user;
console.log(name); // 'John'
console.log(age);  // 30

// Với default value
const { name, country = 'USA' } = user;

// Rename khi destructure
const { name: userName } = user;

// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
```

**Tại sao dùng:**
- Code ngắn gọn hơn
- Lấy đúng những gì cần
- Dễ đọc hơn

### 4. **Spread Operator (...)**

```typescript
// Spread array
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Thêm element vào array
const newArr = [...arr1, 4]; // [1, 2, 3, 4]

// Spread object
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3 }

// Override properties
const updated = { ...obj1, b: 10 }; // { a: 1, b: 10 }
```

**Tại sao dùng:**
- Copy array/object (immutable - không thay đổi bản gốc)
- Merge arrays/objects
- Quan trọng trong React (state immutability)

### 5. **Optional Chaining (?.)**

```typescript
const user = {
  name: 'John',
  address: {
    city: 'NYC'
  }
};

// CÁCH CŨ: Phải check từng level
const city = user && user.address && user.address.city;

// CÁCH MỚI: Optional chaining
const city = user?.address?.city; // 'NYC'
const zipCode = user?.address?.zipCode; // undefined (không lỗi)

// Với array
const firstFriend = user.friends?.[0];

// Với function
const result = user.getName?.();
```

**Tại sao dùng:**
- Tránh lỗi "Cannot read property of undefined"
- Code ngắn gọn hơn
- An toàn hơn khi data có thể null/undefined

### 6. **Nullish Coalescing (??)**

```typescript
// ?? chỉ check null hoặc undefined (khác với ||)

const value1 = null ?? 'default';      // 'default'
const value2 = undefined ?? 'default'; // 'default'
const value3 = 0 ?? 'default';        // 0 (không phải 'default')
const value4 = '' ?? 'default';       // '' (không phải 'default')

// So sánh với ||
const a = 0 || 'default';  // 'default' (vì 0 là falsy)
const b = 0 ?? 'default';  // 0 (vì 0 không phải null/undefined)
```

**Khi nào dùng:**
- Khi muốn check chính xác null/undefined
- Không muốn treat 0 hoặc '' như falsy

---

## 📘 TypeScript Concepts

### 1. **Type Annotations**

```typescript
// Khai báo type cho variables
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let data: any = { anything: 'goes' }; // Tránh dùng 'any'

// Khai báo type cho function
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Arrow function với types
const add = (a: number, b: number): number => a + b;

// Optional parameters (?)
function log(message: string, userId?: number) {
  console.log(message, userId);
}
```

### 2. **Interfaces**

```typescript
// Interface định nghĩa "hình dạng" của object
interface User {
  id: string;           // Required property
  name: string;
  email: string;
  age?: number;         // Optional property
  readonly createdAt: Date; // Readonly - không thể thay đổi
}

// Sử dụng interface
const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date(),
};

// Extend interface
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}
```

**Tại sao dùng:**
- Type safety: bắt lỗi lúc compile time
- Autocomplete trong IDE
- Documentation cho code

### 3. **Union Types**

```typescript
// Union type: một trong nhiều types
type Status = 'pending' | 'success' | 'error';

function setStatus(status: Status) {
  // TypeScript chỉ cho phép 3 giá trị trên
}

setStatus('success'); // ✓ OK
setStatus('loading'); // ✗ Error

// Union với nhiều types
type ID = string | number;

function getUserById(id: ID) {
  // id có thể là string hoặc number
}
```

### 4. **Generics**

```typescript
// Generic cho phép function/class hoạt động với nhiều types

// Generic function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);      // T = number
const str = identity<string>('hello'); // T = string

// Generic với array
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Generic interface
interface Response<T> {
  data: T;
  error: string | null;
}

const userResponse: Response<User> = {
  data: { id: '1', name: 'John', email: 'john@example.com', createdAt: new Date() },
  error: null,
};
```

**Tại sao dùng:**
- Reusable code với type safety
- Dùng cho các function/class generic như Array, Promise, Map

---

## 🏗️ NestJS Decorators

Decorators là các function đặc biệt bắt đầu với `@`. Chúng "decorate" (trang trí/thêm metadata) cho class, method, property.

### 1. **@Module()**

```typescript
@Module({
  imports: [OtherModule],      // Import modules khác
  controllers: [UserController], // Đăng ký controllers
  providers: [UserService],     // Đăng ký services/providers
  exports: [UserService],       // Export để modules khác dùng
})
export class UserModule {}
```

**Giải thích:**
- Module là đơn vị tổ chức code trong NestJS
- Giống như "package" hoặc "namespace"

### 2. **@Injectable()**

```typescript
@Injectable()
export class UserService {
  // Service có thể inject dependencies khác
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
}
```

**Giải thích:**
- Đánh dấu class có thể được inject (Dependency Injection)
- NestJS sẽ tự động tạo instance và inject vào nơi cần

### 3. **WebSocket Decorators**

```typescript
@WebSocketGateway({
  cors: true,
  namespace: '/chat',
})
export class ChatGateway {
  @WebSocketServer() 
  server: Server; // NestJS inject Socket.IO server vào đây

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    // Handle message
  }
}
```

**Giải thích từng decorator:**

- **@WebSocketGateway()**: Đánh dấu class là WebSocket gateway
- **@WebSocketServer()**: Inject Socket.IO server instance
- **@SubscribeMessage('event')**: Lắng nghe event từ client
- **@ConnectedSocket()**: Inject socket của client đang gửi request
- **@MessageBody()**: Lấy data từ message body

### 4. **@UseGuards()**

```typescript
@UseGuards(WsJwtGuard)
export class ChatGateway {
  // Mọi method trong class này phải pass guard
}

// Hoặc áp dụng cho từng method
@SubscribeMessage('sendMessage')
@UseGuards(WsJwtGuard)
handleMessage() {}
```

**Giải thích:**
- Guard là middleware check quyền truy cập
- Chạy TRƯỚC handler method
- Return true = cho phép, false = từ chối

---

## ⚛️ React Hooks

### 1. **useState()**

```typescript
// Cú pháp
const [value, setValue] = useState<Type>(initialValue);

// Ví dụ
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
const [messages, setMessages] = useState<Message[]>([]);

// Update state
setCount(5);                    // Set giá trị mới
setCount(prev => prev + 1);     // Update dựa trên giá trị cũ

// Update array
setMessages([...messages, newMessage]); // Thêm element
setMessages(messages.filter(m => m.id !== deleteId)); // Xóa element
setMessages(messages.map(m => m.id === updateId ? updatedMessage : m)); // Update element
```

**Khi nào dùng:**
- Lưu dữ liệu thay đổi trong component
- Mỗi lần setState, component sẽ re-render

**Lưu ý:**
- State là immutable, không được thay đổi trực tiếp
- Dùng setter function để update

### 2. **useEffect()**

```typescript
// Cú pháp
useEffect(() => {
  // Code chạy sau render
  
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]);

// Run mỗi lần render
useEffect(() => {
  console.log('Runs after every render');
});

// Run chỉ 1 lần khi mount
useEffect(() => {
  console.log('Runs once on mount');
}, []); // Empty dependencies

// Run khi count thay đổi
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// Với cleanup
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Delayed action');
  }, 1000);
  
  return () => {
    clearTimeout(timer); // Cleanup
  };
}, []);
```

**Khi nào dùng:**
- Fetch data khi component mount
- Subscribe/unsubscribe events
- Setup timers, intervals
- Side effects bất kỳ

**Lưu ý:**
- Dependencies array rất quan trọng
- Cleanup function để tránh memory leaks

### 3. **useCallback()**

```typescript
// Cú pháp
const memoizedFunction = useCallback(
  () => {
    // Function body
  },
  [dependencies]
);

// Ví dụ
const handleClick = useCallback(() => {
  console.log('Clicked', count);
}, [count]); // Chỉ tạo lại khi count thay đổi

// Truyền vào child component
<ChildComponent onClick={handleClick} />
```

**Tại sao dùng:**
- Tránh tạo lại function mỗi lần render
- Quan trọng khi truyền function vào child component
- Tối ưu performance

**Khi KHÔNG cần:**
- Function không được truyền vào child component
- Function đơn giản, không ảnh hưởng performance

### 4. **useRef()**

```typescript
// Cú pháp
const ref = useRef<Type>(initialValue);

// Access DOM element
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus(); // Focus vào input
}, []);

return <input ref={inputRef} />;

// Lưu giá trị không trigger re-render
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const startTimer = () => {
  timeoutRef.current = setTimeout(() => {
    console.log('Timer done');
  }, 1000);
};

const cancelTimer = () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
};
```

**Khi nào dùng:**
- Access DOM elements trực tiếp
- Lưu giá trị mà không muốn trigger re-render
- Lưu previous value

---

## 🔌 Socket.IO Patterns

### 1. **Client-Side Connection**

```typescript
import { io, Socket } from 'socket.io-client';

// Tạo connection
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'jwt-token-here',
  },
  transports: ['websocket', 'polling'],
});

// Listen events từ server
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('message', (data) => {
  console.log('Received:', data);
});

// Emit event lên server
socket.emit('sendMessage', { content: 'Hello' });

// Cleanup
socket.disconnect();
```

### 2. **Server-Side Gateway**

```typescript
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  // Emit tới TẤT CẢ clients
  broadcastToAll() {
    this.server.emit('notification', 'Hello everyone');
  }

  // Emit tới clients trong một room
  broadcastToRoom(roomId: string) {
    this.server.to(roomId).emit('message', 'Hello room');
  }

  // Emit tới TẤT CẢ ngoại trừ một client
  broadcastExceptOne(client: Socket) {
    client.broadcast.emit('message', 'Hello others');
  }

  // Emit tới một client cụ thể
  sendToOne(client: Socket) {
    client.emit('message', 'Hello you');
  }
}
```

### 3. **Rooms Pattern**

```typescript
// Join room
client.join('room-123');

// Leave room
client.leave('room-123');

// Emit tới room
this.server.to('room-123').emit('message', 'Hello room');

// Join multiple rooms
client.join(['room-1', 'room-2']);

// Check if in room
const isInRoom = client.rooms.has('room-123');
```

---

## 🎨 Common Patterns

### 1. **Optimistic Updates**

```typescript
// Pattern: Update UI trước, sau đó sync với server
const sendMessage = async (content: string) => {
  // 1. Tạo temp message với ID tạm
  const tempId = `temp-${Date.now()}`;
  const tempMessage = {
    id: tempId,
    content,
    status: 'sending',
  };

  // 2. Update UI ngay lập tức
  setMessages(prev => [...prev, tempMessage]);

  try {
    // 3. Gửi lên server
    const response = await api.sendMessage(content);

    // 4. Update với data thật từ server
    setMessages(prev =>
      prev.map(m => (m.id === tempId ? response.data : m))
    );
  } catch (error) {
    // 5. Nếu lỗi, xóa temp message hoặc đánh dấu failed
    setMessages(prev =>
      prev.map(m => (m.id === tempId ? { ...m, status: 'failed' } : m))
    );
  }
};
```

**Tại sao dùng:**
- UX tốt hơn: không phải chờ server
- App cảm giác nhanh hơn
- Phổ biến trong chat apps, social media

### 2. **Debouncing**

```typescript
// Pattern: Chỉ thực hiện action sau khi user dừng action trong X giây

let timeoutId: NodeJS.Timeout;

const handleSearch = (query: string) => {
  // Clear timeout cũ
  clearTimeout(timeoutId);

  // Set timeout mới
  timeoutId = setTimeout(() => {
    // Chỉ call API sau 500ms user dừng gõ
    api.search(query);
  }, 500);
};

// Trong React với useRef
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const debouncedSearch = useCallback((query: string) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    api.search(query);
  }, 500);
}, []);
```

**Khi nào dùng:**
- Search as you type
- Typing indicators
- Auto-save
- Resize events

### 3. **Event Emitter Pattern**

```typescript
// Singleton class với event emitter
class EventBus {
  private listeners = new Map<string, Function[]>();

  // Đăng ký listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Hủy đăng ký
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event
  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Sử dụng
const bus = new EventBus();

bus.on('userLogin', (user) => {
  console.log('User logged in:', user);
});

bus.emit('userLogin', { id: 1, name: 'John' });
```

---

## ✅ Best Practices

### 1. **Error Handling**

```typescript
// ✗ BAD: Không handle error
async function fetchUser(id: string) {
  const response = await api.getUser(id);
  return response.data;
}

// ✓ GOOD: Handle error properly
async function fetchUser(id: string) {
  try {
    const response = await api.getUser(id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return { data: null, error: error.message };
  }
}
```

### 2. **Validation**

```typescript
// Validate input trước khi xử lý
function sendMessage(content: string) {
  // Check empty
  if (!content || !content.trim()) {
    throw new Error('Message cannot be empty');
  }

  // Check length
  if (content.length > 5000) {
    throw new Error('Message too long');
  }

  // Sanitize
  const sanitized = content.trim();

  // Process...
}
```

### 3. **Type Safety**

```typescript
// ✗ BAD: Dùng any
function processData(data: any) {
  return data.value; // Không biết data có property value không
}

// ✓ GOOD: Define proper types
interface Data {
  value: number;
}

function processData(data: Data) {
  return data.value; // Type safe
}
```

### 4. **Immutability**

```typescript
// ✗ BAD: Mutate array trực tiếp
const addMessage = (message: Message) => {
  messages.push(message); // Mutate original array
  setMessages(messages);   // React không detect change
};

// ✓ GOOD: Tạo array mới
const addMessage = (message: Message) => {
  setMessages([...messages, message]); // New array
};
```

---

## 🎓 Câu Hỏi Thường Gặp

### Q: Tại sao phải dùng TypeScript thay vì JavaScript?
**A:** TypeScript bắt lỗi lúc compile time, có autocomplete tốt hơn, code dễ maintain hơn khi project lớn.

### Q: Khi nào dùng useCallback vs useMemo?
**A:** 
- `useCallback`: Memoize function
- `useMemo`: Memoize giá trị (result của function)

### Q: Tại sao không thể mutate state trực tiếp?
**A:** React dựa vào reference comparison để detect changes. Nếu mutate trực tiếp, reference không thay đổi → React không re-render.

### Q: Socket.IO khác WebSocket thuần như thế nào?
**A:** Socket.IO build trên WebSocket nhưng có thêm:
- Auto-reconnection
- Rooms & namespaces
- Fallback transport (polling nếu WebSocket fail)
- Broadcasting helpers

---

## 📚 Tài Nguyên Học Thêm

1. **TypeScript**: https://www.typescriptlang.org/docs/
2. **React Hooks**: https://react.dev/reference/react
3. **NestJS**: https://docs.nestjs.com/
4. **Socket.IO**: https://socket.io/docs/v4/

---

## 💡 Tips Để Học Hiệu Quả

1. **Đọc code từ trên xuống**: Bắt đầu từ imports, interfaces, rồi đến logic
2. **Debug bằng console.log**: In ra để xem data flow
3. **Thử modify code**: Thay đổi nhỏ để xem kết quả
4. **Đọc error messages**: Error messages thường nói rõ vấn đề
5. **Viết lại từ đầu**: Tự code lại để hiểu sâu hơn

---

Chúc bạn học tốt! 🚀
