import React, { useState, useRef, useCallback } from "react";
import Button from "@/common/components/Button";
import { useTyping } from "@/common/hooks/useTyping";
import { chatApi } from "@/api/chat";
import { MESSAGE_TYPE } from "@/enums/sendMessageType.enum";
import { useChat } from "@/common/hooks/useChat";
import { useAuth } from "@/common/hooks/useAuth";
import { ChatThread } from "@/types/message-type";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/chat-app.store";
import { useAppDispatch } from "@/app/hooks";
import { backToList, toggleInfoWindow } from "@/stores/slices/chatUiSlice";

type ConversationProps = {
  chatThread?: ChatThread;
  onContactInfoToggle?: (isOpen: boolean) => void; // callback to notify parent component
  onBack?: () => void; // callback to go back on mobile
};

const Conversation: React.FC<ConversationProps> = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [message, setMessage] = useState("");
  const { setUserTyping } = useTyping();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatThread = useSelector((state: RootState) => state.chatUi.chatThread);
  const dispatch = useAppDispatch();
  const onContactInfoToggle = () => dispatch(toggleInfoWindow());
  const onBack = () => dispatch(backToList());

  // Use chat hook to handle messages
  const { sendMessage, messages, setMessages } = useChat({
    conversationId: chatThread?.conversationId,
    recipientId: chatThread?.recipientId,
  });
  console.log(messages, )

  // Fetch all messages from API when entering a conversation
  React.useEffect(() => {
    const fetchMessages = async () => {
      console.log('chatThread: ', chatThread);
      if (chatThread?.conversationId) {
        try {
          const data = await chatApi.getConversationMessages(chatThread.conversationId);
          console.log('data: ', data);
          setMessages(Array.isArray(data) ? data : data?.messages || []);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatThread?.conversationId, setMessages]);

  const handleContactInfoToggle = () => {
    const newState = !showContactInfo;
    setShowContactInfo(newState);
    onContactInfoToggle?.(newState); // notify parent component
  };

  // Xử lý typing indicator
  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value);

      const threadId = chatThread?.conversationId;
      if (!threadId) return;

      // Emit typing = true
      setUserTyping(threadId, true);

      // Clear timeout cũ
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout mới - sau 2s không gõ thì tắt typing
      typingTimeoutRef.current = setTimeout(() => {
        setUserTyping(threadId, false);
      }, 500);
    },
    [chatThread, setUserTyping],
  );

  const handleSendMessage = async () => {
    if (!message.trim() || !chatThread) return;
    console.log('chatThread: ', chatThread);

    try {
      const payload: any = {
        content: message.trim(),
        type: MESSAGE_TYPE.TEXT,
      };
      if (chatThread.conversationId) {
        payload.conversationId = chatThread.conversationId;
      } else {
        payload.recipientId = chatThread.recipientId;
      }
      await chatApi.sendMessage(payload);

      setMessage("");
      const threadId = chatThread._id || chatThread.id;
      if (threadId) setUserTyping(threadId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      // Xử lý lỗi gửi tin nhắn
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-2 shadow-[0_1px_5px_1px_#f3f3f3]">
        <div className="flex items-center">
          {/* Back button - chỉ hiển thị trên mobile */}
          <Button
            type="button"
            onClick={onBack}
            className="lg:hidden mr-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            variant="glass"
          >
            <i className="fa-solid fa-arrow-left text-gray-600"></i>
          </Button>
          <img
            className="w-10 h-10 rounded-full mr-3"
            src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg"
            alt="Avatar"
          />
          <div>
            <p className="text-white font-semibold leading-tight">
              {chatThread ? (
                <span className="text-black text-base">{chatThread.name}</span>
              ) : null}
            </p>
            <span className="text-gray-1 text-sm">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Button type="button" variant="social">
            <i className="fa-solid fa-search text-sm text-gray-400"></i>
          </Button>
          <Button type="button" variant="social">
            <i className="fa-solid fa-phone text-sm text-gray-400 cursor-pointer"></i>
          </Button>
          <Button type="button" variant="social">
            <i className="fa-solid fa-video text-sm text-gray-400 cursor-pointer"></i>
          </Button>
          <Button
            type="button"
            onClick={handleContactInfoToggle}
            variant="social"
          >
            <i className="fa-solid fa-circle-info text-sm text-gray-400 cursor-pointer"></i>
          </Button>
          <Button type="button" variant="social">
            <i className="fa-solid fa-ellipsis-vertical text-sm text-gray-400 cursor-pointer"></i>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://dreamschat.dreamstechnologies.com/react/template/assets/bg-01-Cbualscf.png')]">
        {messages.map((m) => {
          if (!m) return null; // Safety check
          const isMe = m.sender?.id === user?._id;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && m.sender && (
                <img
                  className="w-8 h-8 rounded-full mr-2 mt-1"
                  src={
                    m.sender.avatar ||
                    "https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg"
                  }
                  alt="Avatar"
                />
              )}
              <div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 ${isMe ? "bg-purple-1 text-white rounded-br-sm" : "bg-[#0d0d0d] text-white rounded-bl-sm"}`}
                >
                  <p className="text-sm leading-relaxed text-white">
                    {m.content}
                  </p>
                </div>
                <div
                  className={`mt-1 text-[10px] text-gray-1 ${isMe ? "text-right" : "text-left"}`}
                >
                  {new Date(m.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-gray-2 absolute bottom-0 w-full">
        <div className="flex items-center gap-2">
          <Button className="text-black/80 hover:text-white" variant="glass">
            <i className="fa-regular fa-face-smile"></i>
          </Button>
          <Button className="text-black/80 hover:text-white" variant="glass">
            <i className="fa-solid fa-paperclip"></i>
          </Button>
          <textarea
            className="flex-1 bg-gray-3 text-black text-sm px-3 py-2 rounded-md outline-none placeholder:text-gray-1 resize-none"
            placeholder="Type your message..."
            rows={1}
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-violet-600 text-white px-3 py-2 rounded-md text-sm hover:bg-violet-700 transition-colors"
            variant="primary"
          >
            <i className="fa-solid fa-paper-plane mr-1"></i>Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
