// ============================================
// REACT HOOK CHO CHAT - Custom hook để dễ dùng trong components
// ============================================
// File này là một custom React hook - giống như một "công cụ" có thể tái sử dụng
// Trong nhiều components khác nhau. Hook giúp quản lý state và logic của chat.

// ============================================
// IMPORTS - Import các thư viện và modules cần thiết
// ============================================

// Import các React hooks cơ bản:
// - useEffect: Chạy side effects (như kết nối socket, fetch data)
// - useState: Quản lý state (dữ liệu thay đổi) trong component
// - useCallback: Tạo function được memoize (cache) để tối ưu performance
// - useRef: Tạo reference không trigger re-render khi thay đổi
import { useEffect, useState, useCallback, useRef } from 'react';

// Import chatSocket instance - singleton socket client đã config sẵn
import { chatSocket } from '../sockets/chatSocket';

// ============================================
// INTERFACES - Định nghĩa kiểu dữ liệu TypeScript
// ============================================

// Interface cho Message - mô tả cấu trúc của một tin nhắn
interface Message {
  _id: string;               // ID duy nhất của message (từ MongoDB)
  sender: {                  // Thông tin người gửi (nested object)
    _id: string;             // ID của sender
    name: string;            // Tên hiển thị
    username: string;        // Username
    avatar?: string;         // Avatar URL (optional - có thể không có)
  };
  content: string;           // Nội dung tin nhắn
  conversationId: string;    // ID của conversation chứa message này
  type: 'text' | 'image' | 'file' | 'audio' | 'video'; // Loại message (union type)
  status: 'sent' | 'delivered' | 'read'; // Trạng thái message
  createdAt: string;         // Timestamp tạo message (ISO string)
}

// Interface cho TypingUser - mô tả user đang gõ
interface TypingUser {
  userId: string;            // ID của user đang gõ
  username: string;          // Username để hiển thị "X đang gõ..."
}

// Interface cho options truyền vào hook
interface UseChatOptions {
  conversationId: string;    // ID của conversation cần join
  autoConnect?: boolean;     // Có tự động kết nối socket không (default: true)
  autoJoinRoom?: boolean;    // Có tự động join room không (default: true)
}

// ============================================
// CUSTOM HOOK DEFINITION - Định nghĩa hook chính
// ============================================
// Hook này export ra để components khác sử dụng
// Nhận vào một object options với các thuộc tính có default value
export const useChat = ({ conversationId, autoConnect = true, autoJoinRoom = true }: UseChatOptions) => {
  
  // ============================================
  // STATE MANAGEMENT - Quản lý state với useState
  // ============================================
  
  // useState<Type>(initialValue) tạo một state với kiểu dữ liệu Type
  // Return array [value, setter]: value để đọc, setter để update
  
  // State lưu danh sách messages
  // Type: Message[] - array of Message objects
  // Initial: [] - array rỗng
  const [messages, setMessages] = useState<Message[]>([]);
  
  // State lưu danh sách users đang typing
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // State lưu danh sách user IDs đang online
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  // State lưu trạng thái kết nối socket
  const [isConnected, setIsConnected] = useState(false);
  
  // ============================================
  // REF - Tạo reference không trigger re-render
  // ============================================
  
  // useRef<Type>(initialValue) tạo một object ref
  // ref.current để truy cập giá trị
  // Thay đổi ref.current KHÔNG làm component re-render
  // Dùng cho timeout vì không cần re-render khi timeout thay đổi
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // EFFECT 1: Kết nối Socket và Setup Listeners
  // ============================================
  // useEffect(() => { ... }, [dependencies])
  // - Callback function chạy sau khi component render
  // - Chỉ chạy lại khi một trong các dependencies thay đổi
  // - Return function là cleanup (chạy khi unmount hoặc trước khi effect chạy lại)
  
  useEffect(() => {
    // Nếu không auto connect, skip effect này
    if (!autoConnect) return;

    // Lấy JWT token từ localStorage (nơi lưu token sau khi login)
    // localStorage.getItem() return string hoặc null
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for socket connection');
      return; // Không có token thì không kết nối
    }

    // Gọi method connect của chatSocket với token
    chatSocket.connect(token);

    // ============================================
    // ĐỊNH NGHĨA CÁC EVENT HANDLERS
    // ============================================
    // Các function này sẽ được gọi khi socket emit events tương ứng
    
    // Handler khi socket kết nối thành công
    const handleConnect = () => {
      console.log('Chat connected');
      setIsConnected(true); // Update state
      
      // Nếu bật autoJoinRoom và có conversationId, join room
      if (autoJoinRoom && conversationId) {
        chatSocket.joinRoom(conversationId);
      }
    };

    // Handler khi socket ngắt kết nối
    const handleDisconnect = () => {
      console.log('Chat disconnected');
      setIsConnected(false); // Update state
    };

    // Handler khi có lỗi kết nối
    const handleError = (error: any) => {
      console.error('Chat error:', error);
      setIsConnected(false);
    };

    // ============================================
    // ĐĂNG KÝ EVENT LISTENERS
    // ============================================
    // chatSocket.on(eventName, handler) đăng ký lắng nghe event
    // Giống như addEventListener trong DOM
    
    chatSocket.on('connect', handleConnect);
    chatSocket.on('disconnect', handleDisconnect);
    chatSocket.on('error', handleError);

    // ============================================
    // KIỂM TRA NẾU ĐÃ KẾT NỐI TRƯỚC ĐÓ
    // ============================================
    // Trường hợp socket đã connect từ trước (ví dụ: navigate sang page khác)
    if (chatSocket.isConnected()) {
      setIsConnected(true);
      if (autoJoinRoom && conversationId) {
        chatSocket.joinRoom(conversationId);
      }
    }

    // ============================================
    // CLEANUP FUNCTION
    // ============================================
    // Return function này chạy khi:
    // 1. Component unmount (user rời khỏi trang)
    // 2. Trước khi effect chạy lại (khi dependencies thay đổi)
    // Dùng để "dọn dẹp" - unregister listeners tránh memory leaks
    return () => {
      chatSocket.off('connect', handleConnect);
      chatSocket.off('disconnect', handleDisconnect);
      chatSocket.off('error', handleError);
    };
  }, [autoConnect, autoJoinRoom, conversationId]); 
  // Dependencies array: effect chỉ chạy lại khi một trong 3 giá trị này thay đổi

  // ============================================
  // EFFECT 2: Lắng nghe new messages
  // ============================================
  useEffect(() => {
    // Định nghĩa handler cho event 'newMessage'
    const handleNewMessage = (data: { message: Message; conversationId: string }) => {
      // Chỉ xử lý nếu message thuộc conversation hiện tại
      if (data.conversationId === conversationId) {
        // setMessages với callback function
        // 'prev' là giá trị hiện tại của state
        setMessages((prev) => {
          // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
          // array.find() tìm phần tử đầu tiên thỏa điều kiện
          if (prev.find((m) => m._id === data.message._id)) {
            return prev; // Nếu đã có, return state cũ (không update)
          }
          // Nếu chưa có, thêm message mới vào cuối array
          // [...prev] spread operator tạo array mới từ array cũ
          return [...prev, data.message];
        });
      }
    };

    // Đăng ký listener
    chatSocket.on('newMessage', handleNewMessage);

    // Cleanup: hủy đăng ký khi unmount
    return () => {
      chatSocket.off('newMessage', handleNewMessage);
    };
  }, [conversationId]); // Chỉ re-run khi conversationId thay đổi

  // ============================================
  // EFFECT 3: Lắng nghe typing indicators
  // ============================================
  useEffect(() => {
    // Handler khi có user bắt đầu typing
    const handleUserTyping = (data: { userId: string; username: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          // Kiểm tra xem user này đã có trong list chưa
          if (prev.find((u) => u.userId === data.userId)) {
            return prev; // Đã có rồi, không thêm nữa
          }
          // Thêm user mới vào list
          return [...prev, { userId: data.userId, username: data.username }];
        });
      }
    };

    // Handler khi user dừng typing
    const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => 
          // array.filter() tạo array mới chỉ chứa elements thỏa điều kiện
          // Giữ lại tất cả users NGOẠI TRỪ user vừa dừng typing
          prev.filter((u) => u.userId !== data.userId)
        );
      }
    };

    chatSocket.on('userTyping', handleUserTyping);
    chatSocket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      chatSocket.off('userTyping', handleUserTyping);
      chatSocket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [conversationId]);

  // Listen for online users
  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const handleUserStatusChanged = (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers((prev) => {
        if (data.status === 'online') {
          return [...new Set([...prev, data.userId])];
        } else {
          return prev.filter((id) => id !== data.userId);
        }
      });
    };

    chatSocket.on('onlineUsers', handleOnlineUsers);
    chatSocket.on('userStatusChanged', handleUserStatusChanged);

    // Request online users
    chatSocket.getOnlineUsers();

    return () => {
      chatSocket.off('onlineUsers', handleOnlineUsers);
      chatSocket.off('userStatusChanged', handleUserStatusChanged);
    };
  }, []);

  // Listen for read receipts
  useEffect(() => {
    const handleMessageRead = (data: { messageId: string; conversationId: string; readBy: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, status: 'read' as const } : msg
          )
        );
      }
    };

    chatSocket.on('messageRead', handleMessageRead);

    return () => {
      chatSocket.off('messageRead', handleMessageRead);
    };
  }, [conversationId]);

  // ============================================
  // sendMessage - Function để gửi tin nhắn
  // ============================================
  // useCallback() là hook tạo memoized function
  // Function này chỉ được tạo lại khi dependencies thay đổi
  // Giúp tối ưu performance, tránh re-create function mỗi lần render
  const sendMessage = useCallback(
    // Arrow function nhận content và options
    (content: string, options?: { type?: 'text' | 'image'; replyTo?: string; attachments?: string[] }) => {
      // Validation: kiểm tra input
      // .trim() xóa khoảng trắng đầu cuối
      // ! là NOT operator: !true = false, !false = true
      if (!content.trim()) return; // Nếu content rỗng, thoát khỏi function

      // ============================================
      // OPTIMISTIC UPDATE - Cập nhật UI ngay lập tức
      // ============================================
      // Không chờ server response, update UI trước để UX mượt mà
      
      // Tạo tempId duy nhất bằng timestamp hiện tại
      // Date.now() return số milliseconds từ 1/1/1970
      // .toString() convert number thành string
      const tempId = `temp-${Date.now()}`;

      // Tạo optimistic message object
      // Object này sẽ hiển thị trên UI ngay lập tức
      const optimisticMessage: Message = {
        _id: tempId,                    // ID tạm thời
        sender: {
          _id: 'current-user',          // TODO: Replace với actual user ID từ auth context
          name: 'You',                  // Tên hiển thị
          username: 'you',
        },
        content: content.trim(),        // Nội dung đã trim
        conversationId,                 // ID của conversation
        type: options?.type || 'text',  // Type: dùng options.type nếu có, không thì 'text'
        status: 'sent',                 // Trạng thái ban đầu
        createdAt: new Date().toISOString(), // Timestamp hiện tại dạng ISO string
      };

      // Update state messages với optimistic message
      // Spread operator thêm message mới vào cuối array
      setMessages((prev) => [...prev, optimisticMessage]);

      // ============================================
      // GỬI MESSAGE LÊN SERVER
      // ============================================
      // Gọi method sendMessage của chatSocket
      chatSocket.sendMessage({
        conversationId,
        content: content.trim(),
        type: options?.type || 'text',
        replyTo: options?.replyTo,
        attachments: options?.attachments,
        tempId,                         // Gửi tempId để server có thể confirm
      });

      // ============================================
      // LẮNG NGHE CONFIRMATION TỪ SERVER
      // ============================================
      // Khi server lưu message thành công, nó sẽ gửi event 'messageSent'
      const handleMessageSent = (data: { tempId: string; messageId: string }) => {
        // Kiểm tra xem confirmation này có phải cho message vừa gửi không
        if (data.tempId === tempId) {
          // Update message: thay tempId bằng messageId thật từ DB
          setMessages((prev) =>
            // array.map() tạo array mới bằng cách transform mỗi element
            prev.map((msg) => 
              // Ternary operator: condition ? valueIfTrue : valueIfFalse
              (msg._id === tempId) 
                ? { ...msg, _id: data.messageId, status: 'delivered' as const } // Update message này
                : msg // Giữ nguyên messages khác
            )
          );
          // Hủy đăng ký listener này (vì đã nhận confirmation rồi)
          chatSocket.off('messageSent', handleMessageSent);
        }
      };

      // Đăng ký listener để lắng nghe confirmation
      chatSocket.on('messageSent', handleMessageSent);
    },
    [conversationId] // Dependencies: chỉ tạo lại function khi conversationId thay đổi
  );

  // ============================================
  // startTyping - Thông báo đang gõ
  // ============================================
  const startTyping = useCallback(() => {
    // Emit event 'typing' lên server
    chatSocket.startTyping(conversationId);

    // ============================================
    // AUTO-STOP TYPING INDICATOR
    // ============================================
    // Nếu đã có timeout trước đó, clear nó
    // Điều này reset lại timer mỗi khi user gõ
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Tạo timeout mới: tự động stop typing sau 3 giây
    // setTimeout(() => callback, delay) chạy callback sau delay milliseconds
    typingTimeoutRef.current = setTimeout(() => {
      chatSocket.stopTyping(conversationId);
    }, 3000); // 3000ms = 3 giây
  }, [conversationId]);

  // stopTyping - Dừng thông báo đang gõ
  const stopTyping = useCallback(() => {
    // Clear timeout nếu có (hủy auto-stop)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Emit event 'stopTyping' lên server
    chatSocket.stopTyping(conversationId);
  }, [conversationId]);

  // Mark as read
  const markAsRead = useCallback(
    (messageId: string) => {
      chatSocket.markAsRead(conversationId, messageId);
    },
    [conversationId]
  );

  const markConversationAsRead = useCallback(() => {
    chatSocket.markConversationAsRead(conversationId);
  }, [conversationId]);

  // Check if user is online
  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.includes(userId);
    },
    [onlineUsers]
  );

  return {
    // State
    messages,
    typingUsers,
    onlineUsers,
    isConnected,

    // Methods
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    markConversationAsRead,
    isUserOnline,
    
    // Utils
    setMessages, // For manual updates (e.g., loading history)
  };
};

export default useChat;
