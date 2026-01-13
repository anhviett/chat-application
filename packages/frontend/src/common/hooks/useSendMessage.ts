import { useEffect, useState } from 'react';
import { UserType } from "@/types/user-type";
import { chatApi } from "@/api/chat";
import { SendMessage } from '@/types/message-type';

export function useSendMessage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Placeholder for send message logic
    const sendMessage = async (data: SendMessage) => {
        setLoading(true);
        setError(null);

        try {
            const response = await chatApi.sendMessage(data);
            setUsers(response.users);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setError(message || 'Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
        // Implement the logic to send a message to a user
        console.log(`Sending message: "${message}" to user ID: ${toUserId}`);
    };
    return { sendMessage };
}