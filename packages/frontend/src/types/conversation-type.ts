export interface Conversation {
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
    type: 'private' | 'group';
}