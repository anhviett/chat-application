import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './schemas/message.schema';
import { MessageStatus, } from '../common/enums/message-type.enum';
import { Conversation, ConversationType } from './schemas/conversation.schema';
import { SendMessageDto, CreateConversationDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) { }

  // Create a new conversation
  async createConversation(userId: string, dto: CreateConversationDto) {
    const userObjectId = new Types.ObjectId(userId);
    const participantObjectIds = dto.participants.map(p => new Types.ObjectId(p));
    // For direct conversations, check if one already exists
    if (dto.type === ConversationType.DIRECT) {
      const allParticipants = [userObjectId, ...participantObjectIds];
      const existingConversation = await this.conversationModel.findOne({
        type: ConversationType.DIRECT,
        participants: { $all: allParticipants, $size: 2 },
      });

      if (existingConversation) {
        return existingConversation;
      }
    }

    const conversation = new this.conversationModel({
      type: dto.type,
      participants: [userObjectId, ...participantObjectIds],
      createdBy: userObjectId,
      name: dto.name,
      avatar: dto.avatar,
      description: dto.description,
      participantMetadata: new Map(
        [userId, ...dto.participants].map(p => [
          p.toString(),
          {
            unreadCount: 0,
            lastReadAt: new Date(),
          },
        ])
      ),
      admins: dto.type === ConversationType.GROUP ? [userObjectId] : [],
      settings: dto.settings,
    });

    console.log(await conversation.save());
    
    return conversation;
  }

  // Get user conversations
  async getUserConversations(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const conversations = await this.conversationModel
      .find({
        participants: objectId,
        isArchived: false,
      })
      .populate('participants', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return conversations.map(conversation => {
      return {
        ...conversation,
        id: conversation._id,
        _id: conversation._id
        ,
      };
    });

  }

  // Get conversation by ID
  async getConversation(conversationId: string, userId: string) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);
    const conversation = await this.conversationModel
      .findOne({
        _id: conversationObjectId,
        participants: userObjectId,
      })
      .populate('participants', 'firstName lastName avatar')
      .exec();

    return conversation || null;
  }

  // Send a message
  async sendMessage(userId: string, dto: SendMessageDto) {
    console.log(userId, dto);
    const userObjectId = new Types.ObjectId(userId);
    let conversation: Conversation | null = null;
    let conversationObjectId: Types.ObjectId | null = null;

    // Nếu có conversation_id thì tìm conversation
    if (dto.conversation_id) {
      conversationObjectId = new Types.ObjectId(dto.conversation_id);
      conversation = await this.conversationModel.findOne({
        _id: conversationObjectId,
        participants: userObjectId,
      });
    }

    // Nếu có recipientId thì tạo/tìm direct conversation
    if (!conversation && dto.recipientId) {
      conversation = await this.createConversation(userId, {
        type: ConversationType.DIRECT,
        participants: [dto.recipientId],
      });
      conversationObjectId = conversation._id;
    }

    if (!conversation || !conversationObjectId) {
      throw new ForbiddenException('Missing conversation_id or participants/type for new conversation');
    }

    // Kiểm tra các trường quan trọng
    if (!userObjectId || !conversationObjectId || !dto.content || !dto.type) {
      console.error('Missing required field:', {
        userObjectId,
        conversationObjectId,
        content: dto.content,
        type: dto.type,
      });
      throw new ForbiddenException('Missing required field for message');
    }

    const messageData = {
      sender: userObjectId,
      conversation_id: conversationObjectId,
      content: dto.content,
      type: dto.type,
      status: MessageStatus.SENT,
      attachments: dto.attachments || [],
      metadata: dto.metadata,
    };
    const message = new this.messageModel(messageData);
    
    const savedMessage = await message.save();
    const populatedMessage = await savedMessage.populate('sender', 'firstName lastName avatar');

      return {
        _id: populatedMessage._id,
        sender: populatedMessage.sender,
        conversation_id: populatedMessage.conversation_id,
        content: populatedMessage.content,
        type: populatedMessage.type,
        status: populatedMessage.status,
        attachments: populatedMessage.attachments,
        metadata: populatedMessage.metadata,
        readBy: populatedMessage.readBy,
        isDeleted: populatedMessage.isDeleted,
        deletedAt: populatedMessage.deletedAt,
      };
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, userId: string, limit = 50, before?: string) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);

    // Verify user is participant
    const conversation = await this.conversationModel.findOne({
      _id: conversationObjectId,
      participants: userObjectId,
    });

    if (!conversation) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const query: any = {
      conversation_id: conversationObjectId,
      isDeleted: false,
    };

    if (before) {
      query._id = { $lt: new Types.ObjectId(before) };
    }

    return await this.messageModel
      .find(query)
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // Mark message as read
  async markAsRead(conversationId: string, messageId: string, userId: string) {
    const messageObjectId = new Types.ObjectId(messageId);
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);

    const message = await this.messageModel.findOne({
      _id: messageObjectId,
      conversation_id: conversationObjectId,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if already read by user
    const alreadyRead = message.readBy.some((r) => r.user_id.toString() === userId);
    if (!alreadyRead) {
      message.readBy.push({
        user_id: userObjectId,
        readAt: new Date(),
      });
      message.status = MessageStatus.READ;
      await message.save();

      // Update conversation unread count
      await this.conversationModel.findByIdAndUpdate(conversationObjectId, {
        [`participantMetadata.${userId}.unreadCount`]: 0,
        [`participantMetadata.${userId}.lastReadAt`]: new Date(),
      });
    }

    return message;
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: string) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);

    // Get all unread messages
    const messages = await this.messageModel.find({
      conversation_id: conversationObjectId,
      'readBy.userId': { $ne: userObjectId },
      sender: { $ne: userObjectId },
    });

    // Mark all as read
    for (const message of messages) {
      message.readBy.push({
        user_id: userObjectId,
        readAt: new Date(),
      });
      message.status = MessageStatus.READ;
      await message.save();
    }

    // Reset unread count
    await this.conversationModel.findByIdAndUpdate(conversationObjectId, {
      [`participantMetadata.${userId}.unreadCount`]: 0,
      [`participantMetadata.${userId}.lastReadAt`]: new Date(),
    });
  }

  // Delete message
  async deleteMessage(messageId: string, userId: string) {
    const messageObjectId = new Types.ObjectId(messageId);
    const userObjectId = new Types.ObjectId(userId);

    const message = await this.messageModel.findOne({
      _id: messageObjectId,
      sender: userObjectId,
    });

    if (!message) {
      throw new NotFoundException('Message not found or you are not the sender');
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    return message;
  }

  // Add participants to group
  async addParticipants(conversationId: string, userId: string, newParticipants: string[]) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);
    const participantObjectIds = newParticipants.map(p => new Types.ObjectId(p));

    const conversation = await this.conversationModel.findOne({
      _id: conversationObjectId,
      type: { $in: [ConversationType.GROUP, ConversationType.CHANNEL] },
      $or: [{ admins: userObjectId }, { createdBy: userObjectId }],
    });

    if (!conversation) {
      throw new ForbiddenException('Only admins can add participants');
    }

    await this.conversationModel.findByIdAndUpdate(conversationObjectId, {
      $addToSet: { participants: { $each: participantObjectIds } },
    });
  }

  // Remove participant from group
  async removeParticipant(conversationId: string, userId: string, participantToRemove: string) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);
    const participantObjectId = new Types.ObjectId(participantToRemove);

    const conversation = await this.conversationModel.findOne({
      _id: conversationObjectId,
      type: { $in: [ConversationType.GROUP, ConversationType.CHANNEL] },
      $or: [{ admins: userObjectId }, { createdBy: userObjectId }],
    });

    if (!conversation) {
      throw new ForbiddenException('Only admins can remove participants');
    }

    await this.conversationModel.findByIdAndUpdate(conversationObjectId, {
      $pull: { participants: participantObjectId },
    });
  }

  // Leave conversation
  async leaveConversation(conversationId: string, userId: string) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);

    await this.conversationModel.findByIdAndUpdate(conversationObjectId, {
      $pull: { participants: userObjectId, admins: userObjectId },
    });
  }

  async deleteGroupSetting(
    conversationId: string,
    settingName: string,
    userId: string,
  ) {
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);
    const conversation = await this.conversationModel.findOne({
      _id: conversationObjectId,
      type: { $in: [ConversationType.GROUP, ConversationType.CHANNEL] },
      $or: [{ admins: userObjectId }, { createdBy: userObjectId }],
    });
  }
}
