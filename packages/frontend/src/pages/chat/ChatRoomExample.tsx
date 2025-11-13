// Example Chat Component - Complete Implementation
// Location: packages/frontend/src/pages/chat/ChatRoom.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useParams } from 'react-router-dom';

interface ChatRoomProps {
  conversationId?: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ conversationId: propConversationId }) => {
  const { conversationId = propConversationId || '' } = useParams<{ conversationId: string }>();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    typingUsers,
    onlineUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    markConversationAsRead,
    isUserOnline,
  } = useChat({ conversationId });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read when component mounts
  useEffect(() => {
    if (conversationId) {
      markConversationAsRead();
    }
  }, [conversationId, markConversationAsRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Trigger typing indicator
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue('');
    stopTyping();
    
    // Focus back to input
    inputRef.current?.focus();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓✓'; // Double check - blue
      case 'delivered':
        return '✓✓'; // Double check - grey
      case 'sent':
        return '✓'; // Single check
      default:
        return '⏱'; // Clock
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
            <p className="text-sm text-gray-500">
              {typingUsers.length > 0
                ? `${typingUsers.map(u => u.username).join(', ')} đang gõ...`
                : `${onlineUsers.length} người online`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={isConnected ? 'Đã kết nối' : 'Mất kết nối'}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Chưa có tin nhắn nào<br />
              <span className="text-sm">Hãy bắt đầu cuộc trò chuyện!</span>
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender._id === 'current-user'; // Replace with actual user ID
            const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
            const isOnline = isUserOnline(message.sender._id);

            return (
              <div
                key={message._id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar (left side for others) */}
                {!isCurrentUser && showAvatar && (
                  <div className="relative mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                      {message.sender.name.charAt(0).toUpperCase()}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                )}

                {/* Spacer for non-avatar messages */}
                {!isCurrentUser && !showAvatar && <div className="w-10" />}

                {/* Message Bubble */}
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {/* Sender name (only for others) */}
                  {!isCurrentUser && showAvatar && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {message.sender.name}
                    </p>
                  )}

                  {/* Message content */}
                  <p className="text-sm break-words">{message.content}</p>

                  {/* Time and status */}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span
                      className={`text-xs ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                    {isCurrentUser && (
                      <span
                        className={`text-xs ${
                          message.status === 'read' ? 'text-blue-200' : 'text-blue-100'
                        }`}
                      >
                        {getStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-gray-500">
              {typingUsers[0].username} đang gõ...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          {/* Emoji button (optional) */}
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Emoji"
          >
            😊
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => stopTyping()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isConnected}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!isConnected || !inputValue.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
