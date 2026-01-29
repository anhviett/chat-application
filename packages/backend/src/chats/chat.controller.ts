import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
  AddParticipantsDto,
  SendMessageDto,
  UpdateMessageDto,
  CreateMessageStatusDto,
  UpdateMessageStatusDto,
  CreateUserContactDto,
  CreateNotificationDto,
  MarkNotificationAsReadDto,
  CreateBlockedUserDto,
  CreateGroupSettingDto,
  UpdateGroupSettingDto,
  CreateParticipantDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConversationType } from '../common/enums/conversation-type.enum';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  // ============ CONVERSATION ENDPOINTS ============

  @Post('conversations')
  async createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    const userId = req.user?.id;
    return this.chatService.createConversation(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('conversations')
  async getUserConversations(@Request() req: any) {
    const userId = req.user?.id || null;
    if (!userId) {
      return [];
    }
    return this.chatService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  async getConversation(@Request() req, @Param('id') _id: string) {
    const userId = req.user?.id;
    return this.chatService.getConversation(_id, userId);
  }

  // @Put('conversations/:id')
  // async updateConversation(
  //   @Request() req,
  //   @Param('id') conversation_id: string,
  //   @Body() dto: UpdateConversationDto,
  // ) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.updateConversation(conversationId, userId, dto);
  // }

  @Post('conversations/:id/read')
  async markConversationAsRead(@Request() req, @Param('id') conversationId: string) {
    const userId = req.user?.id;
    return this.chatService.markConversationAsRead(conversationId, userId);
  }

  @Post('conversations/:id/leave')
  async leaveConversation(@Request() req, @Param('id') conversationId: string) {
    const userId = req.user?.id;
    return this.chatService.leaveConversation(conversationId, userId);
  }

  // ============ PARTICIPANTS ENDPOINTS ============

  @Post('conversations/:id/participants')
  async addParticipants(
    @Request() req,
    @Param('id') conversationId: string,
    @Body() dto: AddParticipantsDto,
  ) {
    const userId = req.user?.id;
    return this.chatService.addParticipants(conversationId, userId, dto.participants);
  }

  @Delete('conversations/:id/participants/:userId')
  async removeParticipant(
    @Request() req,
    @Param('id') conversationId: string,
    @Param('userId') participantId: string,
  ) {
    const userId = req.user?.id;
    return this.chatService.removeParticipant(conversationId, userId, participantId);
  }

  // ============ MESSAGE ENDPOINTS ============

  @Get('conversations/:id/messages')
  async getMessages(
    @Request() req,
    @Param('id') conversationId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const userId = req.user?.id;
    return this.chatService.getMessages(
      conversationId,
      userId,
      limit ? parseInt(limit) : 50,
      before,
    );
  }

  @Post('messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    const userId = req.user?.id;
    return this.chatService.sendMessage(userId, dto);
  }

  @Put('messages/:id')
  @UseGuards(JwtAuthGuard)
  async updateMessage(
    @Request() req,
    @Param('id') messageId: string,
    @Body() dto: UpdateMessageDto,
  ) {
    const userId = req.user?.id;
    // return this.chatService.updateMessage(messageId, userId, dto);
  }

  // @Delete('messages/:id')
  // async deleteMessage(@Request() req, @Param('id') message_id: string) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.deleteMessage(messageId, userId);
  // }

  // // ============ MESSAGE STATUS ENDPOINTS ============

  // @Post('message-status')
  // async createMessageStatus(@Request() req, @Body() dto: CreateMessageStatusDto) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.createMessageStatus(userId, dto);
  // }

  // @Put('message-status/:id')
  // async updateMessageStatus(
  //   @Request() req,
  //   @Param('id') messageStatus_id: string,
  //   @Body() dto: UpdateMessageStatusDto,
  // ) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.updateMessageStatus(messageStatusId, userId, dto);
  // }

  // // ============ USER CONTACTS ENDPOINTS ============

  // @Get('contacts')
  // async getUserContacts(@Request() req) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.getUserContacts(userId);
  // }

  // @Post('contacts')
  // async addUserContact(@Request() req, @Body() dto: CreateUserContactDto) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.addUserContact(userId, dto.friendId);
  // }

  // @Delete('contacts/:friendId')
  // async removeUserContact(@Request() req, @Param('friendId') friend_id: string) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.removeUserContact(userId, friendId);
  // }

  // // ============ BLOCKED USERS ENDPOINTS ============

  // @Get('blocked')
  // async getBlockedUsers(@Request() req) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.getBlockedUsers(userId);
  // }

  // @Post('blocked')
  // async blockUser(@Request() req, @Body() dto: CreateBlockedUserDto) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.blockUser(userId, dto.blockedUserId);
  // }

  // @Delete('blocked/:blockedUserId')
  // async unblockUser(@Request() req, @Param('blockedUserId') blockedUser_id: string) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.unblockUser(userId, blockedUserId);
  // }

  // // ============ NOTIFICATIONS ENDPOINTS ============

  // @Get('notifications')
  // async getNotifications(@Request() req, @Query('limit') limit?: string) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.getNotifications(userId, limit ? parseInt(limit) : 50);
  // }

  // @Put('notifications/:id')
  // async markNotificationAsRead(
  //   @Request() req,
  //   @Param('id') notification_id: string,
  //   @Body() dto: MarkNotificationAsReadDto,
  // ) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.markNotificationAsRead(notificationId, userId, dto);
  // }

  // // ============ GROUP SETTINGS ENDPOINTS ============

  // @Get('conversations/:conversationId/settings')
  // async getGroupSettings(@Param('conversationId') conversation_id: string) {
  //   return this.chatService.getGroupSettings(conversationId);
  // }

  // @Post('conversations/:conversationId/settings')
  // async createGroupSetting(
  //   @Request() req,
  //   @Param('conversationId') conversation_id: string,
  //   @Body() dto: CreateGroupSettingDto,
  // ) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.createGroupSetting(conversationId, userId, dto);
  // }

  // @Put('conversations/:conversationId/settings/:settingName')
  // async updateGroupSetting(
  //   @Request() req,
  //   @Param('conversationId') conversation_id: string,
  //   @Param('settingName') settingName: string,
  //   @Body() dto: UpdateGroupSettingDto,
  // ) {
  //   const userId = req.user?._id || '6964c526d823f232a21daebb';
  //   return this.chatService.updateGroupSetting(
  //     conversationId,
  //     settingName,
  //     userId,
  //     dto,
  //   );
  // }

  @Delete('conversations/:conversationId/settings/:settingName')
  async deleteGroupSetting(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Param('settingName') settingName: string,
  ) {
    const userId = req.user?.id;
    return this.chatService.deleteGroupSetting(conversationId, settingName, userId);
  }
}
