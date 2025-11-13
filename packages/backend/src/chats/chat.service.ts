import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageStatus } from './schemas/message.schema';
import { Conversation, ConversationType } from './schemas/conversation.schema';
import { SendMessageDto, CreateConversationDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  // Create a new conversation
  async createConversation(userId: string, dto: CreateConversationDto) {
    // For direct conversations, check if one already exists
    if (dto.type === ConversationType.DIRECT) {
      const existingConversation = await this.conversationModel.findOne({
        type: ConversationType.DIRECT,
        participants: { $all: [userId, ...dto.participants], $size: 2 },
      });

      if (existingConversation) {
        return existingConversation;
      }
    }

    const conversation = new this.conversationModel({
      type: dto.type,
      participants: [userId, ...dto.participants],
      createdBy: userId,
      name: dto.name,
      description: dto.description,
      admins: dto.type === ConversationType.GROUP ? [userId] : [],
    });

    return await conversation.save();
  }

  // Get user conversations
  async getUserConversations(userId: string) {
    return await this.conversationModel
      .find({
        participants: userId,
        isArchived: false,
      })
      .populate('participants', 'name username avatar')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  // Get conversation by ID
  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.conversationModel
      .findOne({
        _id: conversationId,
        participants: userId,
      })
      .populate('participants', 'name username avatar')
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  // Send a message
  async sendMessage(userId: string, dto: SendMessageDto) {
    // Verify user is participant
    const conversation = await this.conversationModel.findOne({
      _id: dto.conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const message = new this.messageModel({
      sender: userId,
      conversationId: dto.conversationId,
      content: dto.content,
      type: dto.type,
      replyTo: dto.replyTo,
      attachments: dto.attachments,
    });

    await message.save();

    // Update conversation's last message
    await this.conversationModel.findByIdAndUpdate(dto.conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
      $inc: {
        // Increment unread count for all participants except sender
        ...conversation.participants
          .filter((p) => p.toString() !== userId)
          .reduce((acc, participantId) => {
            acc[`participantMetadata.${participantId}.unreadCount`] = 1;
            return acc;
          }, {}),
      },
    });

    return await message.populate('sender', 'name username avatar');
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, userId: string, limit = 50, before?: string) {
    // Verify user is participant
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const query: any = {
      conversationId,
      isDeleted: false,
    };

    if (before) {
      query._id = { $lt: before };
    }

    return await this.messageModel
      .find(query)
      .populate('sender', 'name username avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // Mark message as read
  async markAsRead(conversationId: string, messageId: string, userId: string) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      conversationId,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if already read by user
    const alreadyRead = message.readBy.some((r) => r.userId.toString() === userId);
    if (!alreadyRead) {
      message.readBy.push({
        userId: new Types.ObjectId(userId),
        readAt: new Date(),
      });
      await message.save();

      // Update conversation unread count
      await this.conversationModel.findByIdAndUpdate(conversationId, {
        [`participantMetadata.${userId}.unreadCount`]: 0,
        [`participantMetadata.${userId}.lastReadAt`]: new Date(),
      });
    }

    return message;
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: string) {
    // Get all unread messages
    const messages = await this.messageModel.find({
      conversationId,
      'readBy.userId': { $ne: userId },
      sender: { $ne: userId },
    });

    // Mark all as read
    for (const message of messages) {
      message.readBy.push({
        userId: new Types.ObjectId(userId),
        readAt: new Date(),
      });
      await message.save();
    }

    // Reset unread count
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      [`participantMetadata.${userId}.unreadCount`]: 0,
      [`participantMetadata.${userId}.lastReadAt`]: new Date(),
    });
  }

  // Delete message
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      sender: userId,
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
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      type: { $in: [ConversationType.GROUP, ConversationType.CHANNEL] },
      $or: [{ admins: userId }, { createdBy: userId }],
    });

    if (!conversation) {
      throw new ForbiddenException('Only admins can add participants');
    }

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      $addToSet: { participants: { $each: newParticipants } },
    });
  }

  // Remove participant from group
  async removeParticipant(conversationId: string, userId: string, participantToRemove: string) {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      type: { $in: [ConversationType.GROUP, ConversationType.CHANNEL] },
      $or: [{ admins: userId }, { createdBy: userId }],
    });

    if (!conversation) {
      throw new ForbiddenException('Only admins can remove participants');
    }

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      $pull: { participants: participantToRemove },
    });
  }

  // Leave conversation
  async leaveConversation(conversationId: string, userId: string) {
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      $pull: { participants: userId, admins: userId },
    });
  }
}
