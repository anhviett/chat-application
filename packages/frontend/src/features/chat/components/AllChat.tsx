import React from "react";

const AllChat = () => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <div className="all-chats-section py-3">
            <div className="flex justify-between items-center mb-4">
                <h5 className="mb-3 font-bold text-xl text-black">All Chats</h5>
                <button className="px-3 text-black font-medium rounded-lg text-sm pb-2.5"
                    onClick={toggleDropdown}
                    type="button">
                    <i className="fa-solid fa-filter"></i>
                </button>
            </div>

            <div className="chat-list">
                {/* Example chat items, replace with dynamic data */}
                <div className="chat-item">Chat 1</div>
                <div className="chat-item">Chat 2</div>
                <div className="chat-item">Chat 3</div>
            </div>
        </div >
    );
}
export default AllChat;