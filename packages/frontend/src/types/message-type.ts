import { MessageType } from '@/enums/sendMessageType.enum';

export interface SendMessage {
    conversationId: number;
    content: string;
    type: MessageType;
}