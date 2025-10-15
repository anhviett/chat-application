import { useState, } from 'react';
import AllContact from "@/features/contact/components/AllContact";

const Contact = () => {
    const [isToggleInvite, setToggleInvite] = useState<boolean>(false);
    const handleToggleInvite = () => {
        setToggleInvite(prevState => !prevState);
    };

    return (
        <>
            <div className="chat-search-header relative mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-xl text-black">Contacts</h4>
                    <div className="flex items-center ml-2">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer mr-3">
                            <i className="fa-solid fa-plus text-sm text-white"></i>
                        </div>
                        <div className="cursor-pointer" onClick={handleToggleInvite}>
                            <i className="fal fa-solid fa-ellipsis-vertical text-gray-1 text-sm"></i>
                        </div>
                    </div>
                </div>

                {/* Invite Others Dropdown - Hiển thị dựa vào props từ Parent */}
                {isToggleInvite && (
                    <div className="absolute w-auto bg-white text-black rounded-md z-[100] right-0 p-3 border border-gray-2 shadow-[0_1px_5px_1px_#f3f3f3] text-sm">
                        <div
                            className="flex items-center justify-center rounded-lg cursor-pointer py-2 px-3 hover:text-purple-1 hover:bg-purple-2"
                            onClick={handleToggleInvite}
                        >
                            <i className="fa-regular fa-paper-plane mr-2"></i>
                            <span>Invite Others</span>
                        </div>
                    </div>
                )}

                {/* Search Box */}
                <div className="search-box relative mb-4">
                    <input
                        type="text"
                        className="w-full bg-white border border-white rounded-md pl-10 pr-4 py-2 text-black focus:outline-none"
                        placeholder="Search"
                    />
                    <i className="fa-solid fa-search absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"></i>
                </div>

                {/* Chat Tabs */}
                <div className="chat-tabs">
                    <AllContact />
                </div>
            </div>
        </>
    );
}

export default Contact;