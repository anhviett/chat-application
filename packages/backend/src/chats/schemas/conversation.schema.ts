import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  CHANNEL = 'channel',
}

@Schema({ timestamps: true })
export class Conversation {
  _id: Types.ObjectId;

  @Prop({ type: String, enum: ConversationType, required: true })
  type: ConversationType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  avatar?: string;

  @Prop()
  description?: string;

  @Prop({
    type: Map,
    of: {
      unreadCount: { type: Number, default: 0 },
      lastReadAt: { type: Date },
      mutedUntil: { type: Date },
    },
    default: {},
  })
  participantMetadata: Map<
    string,
    {
      unreadCount: number;
      lastReadAt?: Date;
      mutedUntil?: Date;
    }
  >;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  admins: Types.ObjectId[];

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: Object })
  settings?: {
    allowMemberToInvite?: boolean;
    allowMemberToSendMedia?: boolean;
    requireApprovalToJoin?: boolean;
  };
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes for performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ type: 1 });
