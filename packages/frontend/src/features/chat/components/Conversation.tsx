import React, { useState, useRef, useCallback } from 'react';
import { useTyping } from '@/contexts/TypingContext';
import { useChat } from '../../../hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

type ConversationProps = {
    chatThreadId?: number;
    onContactInfoToggle?: (isOpen: boolean) => void; // callback to notify parent component
}

const Conversation: React.FC<ConversationProps> = ({ chatThreadId, onContactInfoToggle }) => {
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [message, setMessage] = useState('');
    const { setUserTyping } = useTyping();
    const { user } = useAuth();
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Use chat hook to handle messages
    const { sendMessage, messages } = useChat({
        conversationId: chatThreadId?.toString() || '',
        autoConnect: !!chatThreadId,
        autoJoinRoom: !!chatThreadId,
    });

    const handleContactInfoToggle = () => {
        const newState = !showContactInfo;
        setShowContactInfo(newState);
        onContactInfoToggle?.(newState); // notify parent component
    };

    // Xử lý typing indicator
    const handleTyping = useCallback((value: string) => {
        setMessage(value);

        if (!chatThreadId) return;

        // Emit typing = true
        setUserTyping(chatThreadId, true);

        // Clear timeout cũ
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout mới - sau 2s không gõ thì tắt typing
        typingTimeoutRef.current = setTimeout(() => {
            setUserTyping(chatThreadId, false);
        }, 500);
    }, [chatThreadId, setUserTyping]);

    const handleSendMessage = () => {
        if (!message.trim() || !chatThreadId) return;

        // Send message via socket
        sendMessage(message.trim(), { type: 'text' });

        // Reset
        setMessage('');
        setUserTyping(chatThreadId, false);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-white">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-2 shadow-[0_1px_5px_1px_#f3f3f3]">
                <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full mr-3" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Avatar" />
                    <div>
                        <p className="text-white font-semibold leading-tight">
                            {
                                chatThreadId !== null && chatThreadId !== undefined ? (
                                    <span className="text-black text-base">User {chatThreadId}</span>
                                ) : null
                            }
                        </p>
                        <span className="text-gray-1 text-sm">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                    <button type="button">
                        <i className="fa-solid fa-search text-sm text-gray-400"></i>
                    </button>
                    <button type="button">
                        <i className="fa-solid fa-phone text-sm text-gray-400 cursor-pointer"></i>
                    </button>
                    <button type="button">
                        <i className="fa-solid fa-video text-sm text-gray-400 cursor-pointer"></i>
                    </button>
                    <button type="button" onClick={handleContactInfoToggle}>
                        <i className="fa-solid fa-circle-info text-sm text-gray-400 cursor-pointer"></i>
                    </button>
                    <button type="button">
                        <i className="fa-solid fa-ellipsis-vertical text-sm text-gray-400 cursor-pointer"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://dreamschat.dreamstechnologies.com/react/template/assets/bg-01-Cbualscf.png')]">
                {messages.map((m) => {
                    const isMe = m.sender.id === user?.id || m.sender.id === 1; // Fallback to 1 for optimistic/mock if needed
                    return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <img className="w-8 h-8 rounded-full mr-2 mt-1" src={m.sender.avatar || 'https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg'} alt="Avatar" />
                            )}
                            <div>
                                <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isMe ? 'bg-purple-1 text-white rounded-br-sm' : 'bg-[#0d0d0d] text-white rounded-bl-sm'}`}>
                                    <p className="text-sm leading-relaxed text-white">{m.content}</p>
                                </div>
                                <div className={`mt-1 text-[10px] text-gray-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="px-4 py-3 border-t border-gray-2">
                <div className="flex items-center gap-2">
                    <button className="text-black/80 hover:text-white"><i className="fa-regular fa-face-smile"></i></button>
                    <button className="text-black/80 hover:text-white"><i className="fa-solid fa-paperclip"></i></button>
                    <textarea
                        className="flex-1 bg-gray-3 text-black text-sm px-3 py-2 rounded-md outline-none placeholder:text-gray-1 resize-none"
                        placeholder="Type your message..."
                        rows={1}
                        value={message}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-violet-600 text-white px-3 py-2 rounded-md text-sm hover:bg-violet-700 transition-colors"
                    >
                        <i className="fa-solid fa-paper-plane mr-1"></i>Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Conversation;

