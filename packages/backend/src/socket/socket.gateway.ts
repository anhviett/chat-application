import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chats/chat.service';
import { ObjectId } from 'mongoose';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private onlineUsers = new Map<string, Socket>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`[SocketGateway] Client connected: ${client.id}`);
    this.onlineUsers.set(client.id, client);
    
    // Broadcast online users list
    this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
  }

  handleDisconnect(client: Socket) {
    console.log(`[SocketGateway] Client disconnected: ${client.id}`);
    this.onlineUsers.delete(client.id);
    
    // Broadcast updated online users list
    this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
  }
  
  // 1. React gửi message
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any): Promise<void> {
    try {
      console.log(payload);
      
      // Validate payload
      if (!payload.conversationId || !payload.content) {
        throw new Error('conversationId and content are required');
      }

      if (!payload.userId) {
        throw new Error('userId is required');
      }

      const userId = payload.userId;
      // Lưu message vào database
      const savedMessage = await this.chatService.sendMessage(userId, {
        conversation_id: payload.conversationId,
        content: payload.content,
        type: payload.type,
        attachments: payload.attachments,
        metadata: payload.metadata,
      });
      
      console.log(`[SocketGateway] Message saved:`, savedMessage);
      
      // Gửi xác nhận cho client
      client.emit('messageSent', { success: true, message: savedMessage });
      
      // Broadcast cho tất cả client khác
      client.broadcast.emit('newMessage', savedMessage);
    } catch (error) {
      console.error(`[SocketGateway] sendMessage error:`, error);
      client.emit('messageError', { error: error.message });
    }
  }

  // 2. React gửi typing status
  @SubscribeMessage('userTyping')
  handleUserTyping(@ConnectedSocket() client: Socket, @MessageBody() payload: any): void {
    console.log(`[SocketGateway] userTyping from ${client.id}:`, payload);
    client.broadcast.emit('userTyping', { user_id: client.id, ...payload });
  }

  @SubscribeMessage('userStoppedTyping')
  handleUserStoppedTyping(@ConnectedSocket() client: Socket, @MessageBody() payload: any): void {
    console.log(`[SocketGateway] userStoppedTyping from ${client.id}:`, payload);
    client.broadcast.emit('userStoppedTyping', { user_id: client.id, ...payload });
  }

  // 3. React request online users
  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket): void {
    console.log(`[SocketGateway] getOnlineUsers from ${client.id}`);
    const userList = Array.from(this.onlineUsers.keys());
    client.emit('onlineUsers', userList);
  }

  // 4. React gửi message read status
  @SubscribeMessage('markMessageRead')
  handleMarkMessageRead(@ConnectedSocket() client: Socket, @MessageBody() payload: any): void {
    console.log(`[SocketGateway] markMessageRead from ${client.id}:`, payload);
    client.broadcast.emit('messageRead', { user_id: client.id, ...payload });
  }
}


