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
            <div className="h-screen">
                <div className="relative">
                    {/* Sidebar cố định */}
                    <div className="hidden lg:block fixed left-0 top-0 h-screen bg-backgroundSidebar border-r border-gray-2 z-40">
                        <div className="h-full flex">
                            {/* Sidebar Menu */}
                            <div className="fixed top-0 w-[64px] h-full">
                                <SidebarMenu onOpenInfoTab={handleToggleInfoWindow} />
                            </div>

                            {/* Chat List */}
                            <div className="ml-[64px] pt-3 px-4 py-2.5 transition-all duration-500 ease-in-out flex-1 overflow-y-auto">
                                <div className="chat-search-header relative mb-4">
                                    <div className="flex items-center justify-between mb-3 text-white">
                                        <h4 className="font-bold text-xl text-black">Chats</h4>
                                        <div className="flex items-center ml-2">
                                            <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer mr-3">
                                                <i className="fa-solid fa-plus text-sm"></i>
                                            </div>
                                            <div className="cursor-pointer" onClick={handleToggleInvite}>
                                                <i className="size-5 fal fa-solid fa-ellipsis-vertical text-gray-1 text-sm"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invite Others */}
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
                                </div>

                                <div className="search-box relative mb-4">
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-white rounded-md pl-10 pr-4 py-2 text-black focus:outline-none"
                                        placeholder="Search"
                                    />
                                    <i className="fa-solid fa-search absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"></i>
                                </div>

                                <div className="chat-tabs">
                                    <RecentChat />
                                    <AllChat onSelectChat={setChatThreadId} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content chừa chỗ sidebar */}
                    <div className="lg:ml-[380px]">
                        <div className="lg:grid grid-cols-12">
                            <div className="col-span-8 lg:col-span-8">
                                {/* Conversation */}
                                <Conversation chatThreadId={chatThreadId} />


                            </div>
                            <div className="col-span-4 lg:block hidden">
                                {/* Info Window */}
                                {isInfoWindowOpen && (
                                    <InfoWindow
                                        chatThreadId={chatThreadId?.toString()}
                                        onClose={handleToggleInfoWindow}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Index;