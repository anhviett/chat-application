import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '@/api/chat';

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

interface UseConversationsReturn {
    conversations: Conversation[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useConversations = (): UseConversationsReturn => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await chatApi.getConversations();
            console.log('response: ', response);
            
            if (response && Array.isArray(response)) {
                setConversations(response);
            } else if (response && response.conversations) {
                setConversations(response.conversations);
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        loading,
        error,
        refetch: fetchConversations,
    };
};
