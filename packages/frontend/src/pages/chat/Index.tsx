import RecentChat from "@features/chat/components/RecentChat";
import AllChat from "@features/chat/components/AllChat";
import InfoWindow from "@features/chat/components/InfoWindow";
import Conversation from "@features/chat/components/Conversation";
import SidebarMenu from "@features/chat/components/SidebarMenu";
import { useEffect, useState } from "react";
import { socket } from "@sockets/index";

const Index = () => {
    const [chatThreadId, setChatThreadId] = useState<number | null>(null);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    const [infoTab, setInfoTab] = useState<'profile' | 'media' | 'links' | 'settings'>('profile');

    return (
        <>
            <div className="grid grid-cols-12 gap-4 h-screen">
                <div className="col-span-12 md:col-span-3 md:grid grid-cols-4 gap-2">
                    <div className="sidebar-menu"><SidebarMenu onOpenInfoTab={setInfoTab} /></div>
                    <div className="col-span-3 bg-backgroundSidebar pt-3 md:px-4 px-2 py-2.5">
                        <div className="chat-search-header">
                            <div className="flex items-center justify-between mb-3 text-white">
                                <h4 className="font-bold text-xl">Chats</h4>
                                <div className="flex items-center ml-2">
                                    <div className="size-5 p-1 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer mr-3">
                                        <i className="fa-solid fa-plus text-sm text-white"></i>
                                    </div>
                                    <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
                                </div>
                            </div>
                        </div>
                        <div className="wrap-search">
                            <form className="w-full flex" action="">
                                <input type="text" className="form-control w-full text-gray-400 text-sm bg-backgroundInput p-2" placeholder="Search For Contacts or Messages" />
                                <span className="p-2 cursor-pointer">
                                    <i className="fa-solid fa-search text-sm text-gray-400"></i>
                                </span>
                            </form>
                        </div>
                        <RecentChat />
                        <AllChat selectedId={chatThreadId} onChange={setChatThreadId} />
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Conversation chatThreadId={chatThreadId} />
                </div>
                <div className="hidden md:block md:col-span-3">
                    <InfoWindow key={infoTab} />
                </div>
            </div>
        </>
    );
};
export default Index