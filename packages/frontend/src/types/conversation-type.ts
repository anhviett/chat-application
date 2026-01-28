export interface ConversationType {
  _id: string;
  name: string;
  avatar?: string;
  createdBy: string;
  description?: string;
  isArchived: boolean;
  participants: Array<{
    id: string;
    name: string;
    username?: string;
  }>;
  type: 'direct' | 'group' | 'channel';
}

export interface ConversationsResponse {
  conversations: ConversationType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<void>;
}