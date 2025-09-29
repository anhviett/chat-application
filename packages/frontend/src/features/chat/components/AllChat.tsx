import React from "react";

type AllChatProps = {
    onSelectChat: (id: number) => void;
};

const AllChat: React.FC<AllChatProps> = ({ onSelectChat }) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const chats = [
        { id: 1, name: 'John Doe', message: 'Hey, how are you?', time: '10:30 AM', unread: 2 },
        { id: 2, name: 'Jane Smith', message: 'Meeting at 2 PM', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'Sam Wilson', message: 'Let\'s catch up later', time: '9:15 AM', unread: 5 },
    ];

    return (
        <div className="all-chats-section py-3">
            <div className="flex justify-between items-center mb-4">
                <h5 className="mb-3 font-bold text-xl text-white">All Chats</h5>
                <button className="px-3 text-white/80 hover:text-white font-medium rounded-lg text-sm pb-2.5"
                    onClick={toggleDropdown}
                    type="button">
                    <i className="fa-solid fa-filter"></i>
                </button>
            </div>

            <div className="chat-list space-y-2">
                {chats.map(chat => (
                    <div key={chat.id} onClick={() => onSelectChat(chat.id)} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[#1a1a1a]">
                        <img className="w-10 h-10 rounded-full mr-3" src={`https://i.pravatar.cc/150?img=${chat.id}`} alt="avatar" />
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h6 className="font-semibold text-white">{chat.name}</h6>
                                <p className="text-xs text-gray-400">{chat.time}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-400 truncate">{chat.message}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-violet-600 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">{chat.unread}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
export default AllChat;