import React from "react";
import { useTyping } from "@/common/hooks/useTyping";
// import { useUserList } from "@/common/hooks/useUserList";
// import { ChatThread } from "@/types/message-type";
import {useDispatch } from "react-redux";
// import { RootState } from "@/stores/chat-app.store";
import { useConversations } from "@/common/hooks/useConversations";
import { setChatThread } from "@/stores/slices/chatUiSlice";

const AllChat = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { typingUsers } = useTyping();
  const { conversations, fetchConversation } = useConversations();
//   const chatThread = useSelector((state: RootState) => state.chatUi.chatThread);

  const handleSelectChat = async (user: { _id: string; name: string }) => {
    await fetchConversation(user._id);
    const existingConv = conversations.find(
      (c) => c.participantId === user._id || c._id === user._id,
    );
    if (existingConv) {
      dispatch(
        setChatThread({
          recipientId: user._id,
          name: user.name,
          conversationId: existingConv._id || existingConv.id,
        }),
      );
    } else {
      // Nếu chưa có conversation, vẫn set để show UI gửi tin nhắn đầu tiên
      dispatch(
        setChatThread({
          recipientId: user._id,
          name: user.name,
          conversationId: undefined,
        }),
      );
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="all-chats-section py-1">
      <div className="flex justify-between items-center mb-4">
        <h5 className="mb-3 font-bold text-xl text-black">All Chats</h5>
        <button
          className="px-3 text-white/80 hover:text-white font-medium rounded-lg text-sm pb-2.5"
          onClick={toggleDropdown}
          type="button"
        >
          <i className="fa-solid fa-filter"></i>
        </button>
      </div>
      <div className="chat-list space-y-2">
        {conversations.map((conversation) => {
          const isTyping = typingUsers[conversation._id] || false;

          return (
            <div
              key={conversation._id}
              onClick={() =>
                handleSelectChat({
                  _id: conversation._id,
                  name: conversation.name,
                })
              }
              className="flex items-center p-5 rounded-md cursor-pointer bg-white shadow-[0_1px_5px_1px_#f3f3f3] hover:shadow-[inset_0_0_0_2px_#6338f6]"
            >
              <img
                className="w-10 h-10 rounded-full mr-3"
                src={`https://i.pravatar.cc/150?img=${conversation._id}`}
                alt="avatar"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h6 className="font-semibold text-black">
                    {conversation.name}
                  </h6>
                  <p className="text-sm text-gray-400">
                    {conversation.birthday}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  {isTyping ? (
                    <p className="text-gray-1 text-sm flex items-center space-x-1">
                      <span>is typing</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-dot-fade-1"></span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-dot-fade-2"></span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-dot-fade-3"></span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.message}
                    </p>
                  )}
                  {conversation.unread > 0 && !isTyping && (
                    <span className="bg-red-1 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AllChat;
