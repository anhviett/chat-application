import React from "react";
import { useTyping } from "@/contexts/TypingContext";
import { useConversations } from "../../../common/hooks/useConversations";

type AllChatProps = {
    onSelectChat: (id: string) => void;
};

const AllChat: React.FC<AllChatProps> = ({ onSelectChat }) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { typingUsers } = useTyping();
    const { conversations } = useConversations();
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="all-chats-section py-1">
            <div className="flex justify-between items-center mb-4">
                <h5 className="mb-3 font-bold text-xl text-black">All Chats</h5>
                <button className="px-3 text-white/80 hover:text-white font-medium rounded-lg text-sm pb-2.5"
                    onClick={toggleDropdown}
                    type="button">
                    <i className="fa-solid fa-filter"></i>
                </button>
            </div>
            <div className="chat-list space-y-2">
                {conversations.map(chat => {
                    const isTyping = typingUsers[chat._id] || false;

                    return (
                        <div
                            key={chat._id}
                            onClick={() => onSelectChat(chat._id)}
                            className="flex items-center p-5 rounded-md cursor-pointer bg-white shadow-[0_1px_5px_1px_#f3f3f3] hover:shadow-[inset_0_0_0_2px_#6338f6]"
                        >
                            <img
                                className="w-10 h-10 rounded-full mr-3"
                                src={`https://i.pravatar.cc/150?img=${chat._id}`}
                                alt="avatar"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h6 className="font-semibold text-black">{chat.name}</h6>
                                    <p className="text-sm text-gray-400">{chat.time}</p>
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
                                        <p className="text-sm text-gray-400 truncate">{chat.message}</p>
                                    )}
                                    {chat.unread > 0 && !isTyping && (
                                        <span className="bg-red-1 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
export default AllChat;