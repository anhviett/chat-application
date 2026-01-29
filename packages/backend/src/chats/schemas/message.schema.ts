import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MessageType, MessageStatus } from '../../common/enums/message-type.enum';

export type MessageDocument = HydratedDocument<Message>;
@Schema({ timestamps: true })
export class Message {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversation_id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop({ type: Number, enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Prop({ type: [{ user_id: Types.ObjectId, readAt: Date }], default: [] })
  readBy: Array<{ user_id: Types.ObjectId; readAt: Date }>;

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
MessageSchema.index({ conversation_id: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
