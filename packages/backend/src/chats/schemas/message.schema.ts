import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MessageType } from '../../common/enums/message-type.enum';
export { MessageType };

export type MessageDocument = HydratedDocument<Message>;

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}
@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop({ type: String, enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Prop({ type: [{ userId: Types.ObjectId, readAt: Date }], default: [] })
  readBy: Array<{ userId: Types.ObjectId; readAt: Date }>;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  replyTo?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
