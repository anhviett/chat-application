import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })

export class SocketGateway implements OnGatewayConnection, OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
    
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    console.log(`Message received from ${client.id}: ${payload}`);
    this.server.emit('message', payload); // Broadcast the message to all connected clients
  }
  
}
