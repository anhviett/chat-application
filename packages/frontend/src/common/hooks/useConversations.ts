import { useState, useEffect, useCallback } from "react";
import { ConversationType, ConversationsResponse } from "@/types/conversation-type";
import { conversationApi } from "@/api/conversation";

export const useConversations = (): ConversationsResponse => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conversationApi.getConversations();

      if (response && Array.isArray(response)) {
        setConversations(response);
      } else if (response && response.conversations) {
        setConversations(response.conversations);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversations",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConversation = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await conversationApi.getConversation(conversationId);
      const data = Array.isArray(response)
        ? response
        : response
          ? [response]
          : [];
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversation",
      );
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
    fetchConversation,
  };
};
