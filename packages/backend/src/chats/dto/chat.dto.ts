import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsArray,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { MessageType } from '../../common/enums/message-type.enum';

// ============ CONVERSATION DTOs ============

export class CreateConversationDto {
  @IsEnum(['direct', 'group', 'channel'])
  @IsNotEmpty()
  type: 'direct' | 'group' | 'channel';

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  participants: string[];

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  settings?: {
    allowMemberToInvite?: boolean;
    allowMemberToSendMedia?: boolean;
    requireApprovalToJoin?: boolean;
  };
}

export class UpdateConversationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  admins?: string[];

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

export class AddParticipantsDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  participants: string[];
}

// ============ MESSAGE DTOs ============

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsMongoId()
  @IsOptional()
  replyTo?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

// ============ MESSAGE STATUS DTOs ============

export class CreateMessageStatusDto {
  @IsMongoId()
  @IsNotEmpty()
  messageId: string;

  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  @IsEnum(['sent', 'delivered', 'read'])
  @IsNotEmpty()
  status: 'sent' | 'delivered' | 'read';
}

export class UpdateMessageStatusDto {
  @IsEnum(['sent', 'delivered', 'read'])
  @IsNotEmpty()
  status: 'sent' | 'delivered' | 'read';
}

// ============ USER CONTACTS DTOs ============

export class CreateUserContactDto {
  @IsMongoId()
  @IsNotEmpty()
  friendId: string;
}

export class RemoveUserContactDto {
  @IsMongoId()
  @IsNotEmpty()
  friendId: string;
}

// ============ NOTIFICATIONS DTOs ============

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['message', 'friend_request', 'group_invite', 'mention'])
  @IsNotEmpty()
  type: 'message' | 'friend_request' | 'group_invite' | 'mention';

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class MarkNotificationAsReadDto {
  @IsBoolean()
  @IsNotEmpty()
  isSeen: boolean;
}

// ============ BLOCKED USERS DTOs ============

export class CreateBlockedUserDto {
  @IsMongoId()
  @IsNotEmpty()
  blockedUserId: string;
}

export class RemoveBlockedUserDto {
  @IsMongoId()
  @IsNotEmpty()
  blockedUserId: string;
}

// ============ GROUP SETTINGS DTOs ============

export class CreateGroupSettingDto {
  @IsString()
  @IsNotEmpty()
  settingName: string;

  @IsNotEmpty()
  settingValue: string | boolean | number;
}

export class UpdateGroupSettingDto {
  @IsNotEmpty()
  settingValue: string | boolean | number;
}

// ============ PARTICIPANTS DTOs ============

export class CreateParticipantDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}

export class RemoveParticipantDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}

// ============ SOCKET/WEBSOCKET DTOs ============

export class JoinRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}

export class TypingDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}

export class ReadMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

  @IsMongoId()
  @IsNotEmpty()
  messageId: string;
}
