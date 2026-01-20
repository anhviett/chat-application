import { useState } from 'react';

export function useGeminiAi() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    /**
     * Gửi prompt tới Gemini AI, nhận stream kết quả và cập nhật messages.
     * @param prompt Nội dung người dùng nhập
     * @param history Lịch sử hội thoại (nếu cần)
     */
    const sendMessage = async (prompt: string, history: any[] = []) => {
        if (!prompt.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: prompt };
        const aiId = Date.now() + 1;
        const aiMsg = { id: aiId, role: 'model', content: '' };

        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setIsTyping(true);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/chat-gemini/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, history }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const cleanChunk = chunk.replace(/data: /g, '').replace(/\n\n/g, '');

                setMessages((prev: any) =>
                    prev.map((msg: any) =>
                        msg.id === aiId ? { ...msg, content: msg.content + cleanChunk } : msg
                    )
                );
            }
        } catch (error) {
            console.error('Lỗi stream:', error);
        } finally {
            setIsTyping(false);
        }
    };

    return {
        messages,
        setMessages,
        input,
        setInput,
        isTyping,
        sendMessage,
    };
}