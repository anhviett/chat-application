import RecentChat from "@features/chat/components/RecentChat";
import AllChat from "@features/chat/components/AllChat";
import InfoWindow from "@features/chat/components/InfoWindow";
import Conversation from "@features/chat/components/Conversation";
import SidebarMenu from "@features/chat/components/SidebarMenu";
import { useEffect, useState } from "react";
import { socket } from "@sockets/index";

const Index = () => {
    const [chatThreadId, setChatThreadId] = useState<number | null>(1);
    const [isInfoWindowOpen, setInfoWindowOpen] = useState(true);
    const [isToggleInvite, setToggleInvite] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    const handleToggleInfoWindow = () => {
        setInfoWindowOpen(prevState => !prevState);
    }
    const handleToggleInvite = () => {
        setToggleInvite(prevState => !prevState);
    }

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar Menu */}
                <div className="w-20 flex-shrink-0">
                    <SidebarMenu onOpenInfoTab={handleToggleInfoWindow} />
                </div>

                {/* Chat List */}
                <div className="w-96 flex-shrink-0 bg-backgroundSidebar pt-3 md:px-4 px-2 py-2.5 border-r border-[#222224]">
                    <div className="chat-search-header relative">
                        <div className="flex items-center justify-between mb-3 text-white">
                            <h4 className="font-bold text-xl text-black">Chats</h4>
                            <div className="flex items-center ml-2">
                                <div className="w-8 h-8 rounded-full bg-violet-600 m-auto flex items-center justify-center cursor-pointer mr-3">
                                    <i className="fa-solid fa-plus text-sm mt-0.5"></i>
                                </div>
                                <div className="cursor-pointer" onClick={handleToggleInvite}>
                                    <i className="size-5 fal fa-solid fa-ellipsis-vertical text-gray-1 text-sm"></i>
                                </div>
                            </div>
                        </div>
                        {/* Invite Others */}
                        {isToggleInvite && (
                            <div className="absolute w-auto bg-white text-black rounded-md z-[10] right-0 py-4 px-3 border border-gray-2 shadow-[0_1px_5px_1px_#f3f3f3] p-3 text-sm">
                                <div className="flex items-center justify-center rounded-lg cursor-pointer py-2 px-3 hover:text-purple-1 hover:bg-purple-2" onClick={handleToggleInvite}>
                                    <i className="fa-regular fa-paper-plane mr-2"></i>
                                    <span>Invite Others</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="search-box relative mb-4">
                        <i className="fa-solid fa-search absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" className="w-full bg-[#0d0d0d] border border-[#222224] rounded-md pl-10 pr-4 py-2 text-white focus:outline-none" placeholder="Search" />
                    </div>
                    <div className="chat-tabs">
                        <RecentChat />
                        <AllChat onSelectChat={setChatThreadId} />
                    </div>
                </div>

                {/* Conversation */}
                <div className="flex-1">
                    <Conversation chatThreadId={chatThreadId} />
                </div>

                {/* Info Window */}
                {isInfoWindowOpen && (
                    <div className="w-96 flex-shrink-0">
                        <InfoWindow chatThreadId={chatThreadId?.toString()} onClose={handleToggleInfoWindow} />
                    </div>
                )}

                
            </div>
        </>
    );
};

export default Index;