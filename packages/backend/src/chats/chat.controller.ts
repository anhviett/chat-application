import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/chat.dto';

// Create a simple JWT guard for REST endpoints
// You should import from your auth module instead
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  // @UseGuards(JwtAuthGuard) // Add your JWT auth guard
  async createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    // For now, hardcode userId - replace with req.user.id from JWT guard
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.createConversation(userId, dto);
  }

  @Get('conversations')
  // @UseGuards(JwtAuthGuard)
  async getUserConversations(@Request() req) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  // @UseGuards(JwtAuthGuard)
  async getConversation(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.getConversation(id, userId);
  }

  @Get('conversations/:id/messages')
  // @UseGuards(JwtAuthGuard)
  async getMessages(
    @Request() req,
    @Param('id') conversationId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.getMessages(
      conversationId,
      userId,
      limit ? parseInt(limit) : 50,
      before,
    );
  }

  @Post('conversations/:id/read')
  // @UseGuards(JwtAuthGuard)
  async markConversationAsRead(@Request() req, @Param('id') conversationId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.markConversationAsRead(conversationId, userId);
  }

  @Delete('messages/:id')
  // @UseGuards(JwtAuthGuard)
  async deleteMessage(@Request() req, @Param('id') messageId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.deleteMessage(messageId, userId);
  }

  @Post('conversations/:id/participants')
  // @UseGuards(JwtAuthGuard)
  async addParticipants(
    @Request() req,
    @Param('id') conversationId: string,
    @Body('participants') participants: string[],
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.addParticipants(conversationId, userId, participants);
  }

  @Delete('conversations/:id/participants/:userId')
  // @UseGuards(JwtAuthGuard)
  async removeParticipant(
    @Request() req,
    @Param('id') conversationId: string,
    @Param('userId') participantId: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.removeParticipant(conversationId, userId, participantId);
  }

  @Post('conversations/:id/leave')
  // @UseGuards(JwtAuthGuard)
  async leaveConversation(@Request() req, @Param('id') conversationId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.chatService.leaveConversation(conversationId, userId);
  }
}
