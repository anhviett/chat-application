import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        throw new WsException('Unauthorized - No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'change_this_secret',
      });

      // Attach user to socket for later use
      client.data.user = payload;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized - Invalid token');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Try to get token from handshake auth
    const token = client.handshake?.auth?.token;
    if (token) {
      return token;
    }

    // Try to get token from query params
    const queryToken = client.handshake?.query?.token;
    if (queryToken && typeof queryToken === 'string') {
      return queryToken;
    }

    // Try to get token from headers
    const authHeader = client.handshake?.headers?.authorization;
    if (authHeader) {
      const [type, tokenValue] = authHeader.split(' ');
      return type === 'Bearer' ? tokenValue : undefined;
    }

    return undefined;
  }
}
