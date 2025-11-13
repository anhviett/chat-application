// ============================================
// IMPORTS - Import các thư viện cần thiết
// ============================================

// Import decorators từ NestJS cho WebSocket
// - WebSocketGateway: Đánh dấu class này là một WebSocket gateway
// - WebSocketServer: Inject Socket.IO server instance vào class
// - SubscribeMessage: Decorator để lắng nghe một event từ client
// - OnGatewayConnection: Interface để handle khi client kết nối
// - OnGatewayDisconnect: Interface để handle khi client ngắt kết nối
// - MessageBody: Lấy data từ message body
// - ConnectedSocket: Lấy socket instance của client đang gửi request
// - WsException: Exception cho WebSocket
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';

// Import Server và Socket từ Socket.IO (thư viện WebSocket)
import { Server, Socket } from 'socket.io';

// Import các decorators và utilities từ NestJS common
import { UseGuards, UsePipes, ValidationPipe, Logger } from '@nestjs/common';

// Import service để xử lý business logic
import { ChatService } from './chat.service';

// Import guard để xác thực JWT cho WebSocket
import { WsJwtGuard } from './guards/ws-jwt.guard';

// Import các DTO (Data Transfer Object) - định nghĩa cấu trúc data
import {
  SendMessageDto,
  JoinRoomDto,
  TypingDto,
  ReadMessageDto,
  CreateConversationDto,
} from './dto/chat.dto';

// ============================================
// INTERFACE - Định nghĩa kiểu dữ liệu
// ============================================

// Interface này mở rộng Socket của Socket.IO để thêm thông tin user
// Sau khi JWT được verify, thông tin user sẽ được lưu vào socket.data.user
interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      sub: string;       // user ID (subject trong JWT token)
      email: string;     // email của user
      username?: string; // username (optional - có thể có hoặc không)
    };
  };
}

// ============================================
// @WebSocketGateway - Decorator đánh dấu class này là WebSocket gateway
// ============================================
// Tham số configuration:
// - cors: Cấu hình Cross-Origin Resource Sharing để frontend khác domain có thể kết nối
// - namespace: '/chat' - Tạo một namespace riêng cho chat (URL: http://localhost:3000/chat)
//   Namespace giúp tách biệt các loại WebSocket khác nhau (ví dụ: /chat, /notifications)
@WebSocketGateway({
  cors: {
    // Cho phép frontend từ domain này kết nối (hoặc '*' cho tất cả - không nên dùng production)
    origin: process.env.FRONTEND_URL || '*',
    credentials: true, // Cho phép gửi credentials (cookies, headers)
  },
  namespace: '/chat', // URL namespace: ws://localhost:3000/chat
})

// ============================================
// @UseGuards - Áp dụng guard cho toàn bộ gateway
// ============================================
// WsJwtGuard sẽ chạy trước mọi event handler để verify JWT token
// Nếu token không hợp lệ, connection sẽ bị từ chối
@UseGuards(WsJwtGuard)

// ============================================
// CLASS DEFINITION - Định nghĩa class chính
// ============================================
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // @WebSocketServer - Decorator inject Socket.IO server instance
  // 'server' này sẽ được NestJS tự động gán khi gateway khởi tạo
  // Dùng để emit events tới tất cả hoặc một nhóm clients
  @WebSocketServer() server: Server;
  
  // Logger - Dùng để log thông tin debug, lỗi ra console/file
  // Tham số 'ChatGateway' là tên context xuất hiện trong logs
  private logger = new Logger('ChatGateway');
  
  // ============================================
  // STATE MANAGEMENT - Quản lý trạng thái
  // ============================================
  
  // Map lưu danh sách user đang online
  // Key: userId (string)
  // Value: Set<socketId> - Một user có thể có nhiều socket (đa thiết bị)
  // Ví dụ: { "user123": Set(["socket-abc", "socket-xyz"]) }
  private onlineUsers = new Map<string, Set<string>>();
  
  // Map lưu danh sách user đang typing trong mỗi conversation
  // Key: conversationId (string)
  // Value: Set<userId> - Danh sách các userId đang typing
  // Ví dụ: { "conv456": Set(["user123", "user789"]) }
  private typingUsers = new Map<string, Set<string>>();

  // ============================================
  // CONSTRUCTOR - Dependency Injection
  // ============================================
  // NestJS tự động inject ChatService vào constructor
  // 'private readonly' tạo property và gán giá trị cùng lúc
  constructor(private readonly chatService: ChatService) {}

  // ============================================
  // handleConnection - Xử lý khi client kết nối
  // ============================================
  // Method này được gọi TỰ ĐỘNG mỗi khi có client kết nối WebSocket
  // Tham số 'client' là socket instance của client vừa kết nối
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Lấy userId từ socket.data.user (đã được set bởi WsJwtGuard)
      // '?.' là optional chaining - nếu client.data.user null thì không lỗi
      const userId = client.data.user?.sub;
      
      // Nếu không có userId (JWT không hợp lệ), ngắt kết nối
      if (!userId) {
        client.disconnect(); // Ngắt kết nối với client này
        return; // Thoát khỏi function
      }

      // ============================================
      // THÊM USER VÀO DANH SÁCH ONLINE
      // ============================================
      
      // Kiểm tra xem user này đã có trong Map chưa
      if (!this.onlineUsers.has(userId)) {
        // Nếu chưa có, tạo một Set mới để lưu các socketId của user này
        this.onlineUsers.set(userId, new Set());
      }
      
      // Lấy Set của user và thêm socketId mới vào
      // '!' là non-null assertion - ta chắc chắn nó không null vì vừa set ở trên
      this.onlineUsers.get(userId)!.add(client.id);

      // Log thông tin ra console để debug
      this.logger.log(`User ${userId} connected with socket ${client.id}`);

      // ============================================
      // TỰ ĐỘNG JOIN CÁC ROOM CỦA USER
      // ============================================
      
      // Lấy tất cả conversations mà user này tham gia
      const conversations = await this.chatService.getUserConversations(userId);
      
      // Duyệt qua từng conversation và join socket vào room tương ứng
      // Room trong Socket.IO giống như một "phòng" - khi emit vào room, 
      // chỉ những socket trong room đó mới nhận được
      conversations.forEach((conv) => {
        // Join room với tên pattern: "conversation:${conversationId}"
        client.join(`conversation:${conv._id}`);
      });

      // ============================================
      // BROADCAST TRẠNG THÁI ONLINE
      // ============================================
      
      // Gửi event 'userStatusChanged' tới TẤT CẢ clients khác
      // để họ biết user này đã online
      this.broadcastUserStatus(userId, 'online');

      // Gửi danh sách tất cả user online cho client vừa kết nối
      // 'client.emit' chỉ gửi tới client này, không gửi tới ai khác
      // Array.from() convert Map keys thành Array
      client.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
      
    } catch (error) {
      // Nếu có lỗi xảy ra, log lỗi ra console
      this.logger.error(`Connection error: ${error.message}`);
      // Ngắt kết nối với client
      client.disconnect();
    }
  }

  // ============================================
  // handleDisconnect - Xử lý khi client ngắt kết nối
  // ============================================
  // Method này được gọi TỰ ĐỘNG khi client ngắt kết nối
  // (đóng browser, mất mạng, client.disconnect(), v.v.)
  async handleDisconnect(client: AuthenticatedSocket) {
    try {
      const userId = client.data.user?.sub;
      if (!userId) return; // Nếu không có userId, thoát

      // ============================================
      // XÓA SOCKET KHỎI DANH SÁCH ONLINE
      // ============================================
      
      // Lấy Set chứa các socketId của user này
      const userSockets = this.onlineUsers.get(userId);
      
      if (userSockets) {
        // Xóa socketId này khỏi Set
        userSockets.delete(client.id);
        
        // Kiểm tra xem user còn socket nào đang kết nối không
        // Nếu size = 0 nghĩa là user đã offline hoàn toàn
        if (userSockets.size === 0) {
          // Xóa user khỏi Map
          this.onlineUsers.delete(userId);
          // Broadcast trạng thái offline tới tất cả clients
          this.broadcastUserStatus(userId, 'offline');
        }
      }

      // ============================================
      // XÓA TYPING INDICATORS
      // ============================================
      
      // Duyệt qua tất cả conversations để xóa typing indicator của user này
      // forEach với callback nhận (value, key, map)
      this.typingUsers.forEach((typingSet, conversationId) => {
        // Kiểm tra xem user có đang typing trong conversation này không
        if (typingSet.has(userId)) {
          // Xóa userId khỏi Set
          typingSet.delete(userId);
          
          // Gửi event tới tất cả users trong conversation này
          // để họ biết user này đã dừng typing
          this.server.to(`conversation:${conversationId}`).emit('userStoppedTyping', {
            userId,
            conversationId,
          });
        }
      });

      this.logger.log(`User ${userId} disconnected socket ${client.id}`);
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }

  // ============================================
  // @SubscribeMessage - Lắng nghe event từ client
  // ============================================
  // Decorator này đánh dấu method sẽ xử lý event 'createConversation'
  // Khi client emit: socket.emit('createConversation', data)
  // Method này sẽ được gọi
  
  // @UsePipes - Áp dụng ValidationPipe để validate DTO
  // ValidationPipe sẽ check data từ client có đúng format CreateConversationDto không
  @SubscribeMessage('createConversation')
  @UsePipes(new ValidationPipe())
  async handleCreateConversation(
    // @ConnectedSocket - Inject socket instance của client gửi request
    @ConnectedSocket() client: AuthenticatedSocket,
    // @MessageBody - Lấy data từ message body và map vào DTO
    @MessageBody() dto: CreateConversationDto,
  ) {
    try {
      // Lấy userId của user đang gửi request
      const userId = client.data.user.sub;
      
      // Gọi service để tạo conversation trong database
      const conversation = await this.chatService.createConversation(userId, dto);

      // ============================================
      // CHO TẤT CẢ PARTICIPANTS JOIN ROOM
      // ============================================
      
      // Tạo array chứa tất cả participant IDs (bao gồm cả user tạo)
      const allParticipants = [userId, ...dto.participants];
      
      // Duyệt qua từng participant
      allParticipants.forEach((participantId) => {
        // Lấy tất cả socketIds của participant này
        this.getUserSockets(participantId).forEach((socketId) => {
          // Lấy socket instance từ socketId
          // '?.' để tránh lỗi nếu socket không tồn tại
          this.server.sockets.sockets.get(socketId)?.join(`conversation:${conversation._id}`);
        });
      });

      // Gửi event 'conversationCreated' tới TẤT CẢ users trong room này
      // 'to()' chỉ định room, 'emit()' gửi event
      this.server.to(`conversation:${conversation._id}`).emit('conversationCreated', conversation);

      // Return response về client (optional)
      // Client có thể lắng nghe response này nếu cần
      return { success: true, conversation };
    } catch (error) {
      // Throw WsException để gửi lỗi về client
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('joinRoom')
  @UsePipes(new ValidationPipe())
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    try {
      const userId = client.data.user.sub;
      
      // Verify user has access to this conversation
      await this.chatService.getConversation(dto.conversationId, userId);
      
      client.join(`conversation:${dto.conversationId}`);
      this.logger.log(`User ${userId} joined room ${dto.conversationId}`);

      return { success: true, conversationId: dto.conversationId };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // ============================================
  // handleSendMessage - Xử lý khi user gửi tin nhắn
  // ============================================
  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe()) // Validate SendMessageDto
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: SendMessageDto,
  ) {
    try {
      const userId = client.data.user.sub;
      
      // Gọi service để lưu message vào database
      const message = await this.chatService.sendMessage(userId, dto);

      // Dừng typing indicator của user này (vì đã gửi message rồi)
      this.handleStopTyping(client, { conversationId: dto.conversationId });

      // ============================================
      // BROADCAST MESSAGE TỚI TẤT CẢ USERS TRONG CONVERSATION
      // ============================================
      // 'to()' chỉ định room cần gửi
      // 'emit()' gửi event với data
      // Tất cả socket trong room này sẽ nhận được event 'newMessage'
      this.server.to(`conversation:${dto.conversationId}`).emit('newMessage', {
        message,
        conversationId: dto.conversationId,
      });

      // ============================================
      // GỬI CONFIRMATION VỀ CLIENT GỬI MESSAGE
      // ============================================
      // 'client.emit' chỉ gửi tới client này (không gửi broadcast)
      // Client có thể dùng tempId để update optimistic message
      client.emit('messageSent', {
        tempId: dto['tempId'], // tempId do client tự tạo khi gửi
        messageId: message._id, // messageId thật từ database
      });

      return { success: true, message };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // ============================================
  // handleTyping - Xử lý typing indicator
  // ============================================
  @SubscribeMessage('typing')
  @UsePipes(new ValidationPipe())
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: TypingDto,
  ) {
    try {
      const userId = client.data.user.sub;

      // Kiểm tra xem conversation này đã có trong Map chưa
      if (!this.typingUsers.has(dto.conversationId)) {
        // Nếu chưa, tạo Set mới
        this.typingUsers.set(dto.conversationId, new Set());
      }
      
      // Thêm userId vào Set của conversation này
      // '!' là non-null assertion vì ta vừa set ở trên
      this.typingUsers.get(dto.conversationId)!.add(userId);

      // ============================================
      // BROADCAST TYPING EVENT
      // ============================================
      // 'client.to()' gửi tới TẤT CẢ trong room NGOẠI TRỪ client này
      // Vì client đang gõ thì không cần nhận event của chính mình
      client.to(`conversation:${dto.conversationId}`).emit('userTyping', {
        userId,
        conversationId: dto.conversationId,
        username: client.data.user.username || client.data.user.email,
      });

      return { success: true };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('stopTyping')
  @UsePipes(new ValidationPipe())
  handleStopTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: TypingDto,
  ) {
    try {
      const userId = client.data.user.sub;

      const typingSet = this.typingUsers.get(dto.conversationId);
      if (typingSet) {
        typingSet.delete(userId);
      }

      client.to(`conversation:${dto.conversationId}`).emit('userStoppedTyping', {
        userId,
        conversationId: dto.conversationId,
      });

      return { success: true };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('markAsRead')
  @UsePipes(new ValidationPipe())
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: ReadMessageDto,
  ) {
    try {
      const userId = client.data.user.sub;
      await this.chatService.markAsRead(dto.conversationId, dto.messageId, userId);

      // Notify sender that message was read
      this.server.to(`conversation:${dto.conversationId}`).emit('messageRead', {
        messageId: dto.messageId,
        conversationId: dto.conversationId,
        readBy: userId,
        readAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('markConversationAsRead')
  @UsePipes(new ValidationPipe())
  async handleMarkConversationAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    try {
      const userId = client.data.user.sub;
      await this.chatService.markConversationAsRead(dto.conversationId, userId);

      this.server.to(`conversation:${dto.conversationId}`).emit('conversationRead', {
        conversationId: dto.conversationId,
        readBy: userId,
        readAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    return {
      onlineUsers: Array.from(this.onlineUsers.keys()),
    };
  }

  // Helper methods
  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    this.server.emit('userStatusChanged', {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  private getUserSockets(userId: string): string[] {
    return Array.from(this.onlineUsers.get(userId) || []);
  }

  // Method to send notification to specific user
  notifyUser(userId: string, event: string, data: any) {
    this.getUserSockets(userId).forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
  }
}
