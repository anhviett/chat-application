import { IsString, IsNotEmpty, IsEnum, IsOptional, IsMongoId, IsArray } from 'class-validator';
import { MessageType } from '../schemas/message.schema';

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
}

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
  description?: string;
}
