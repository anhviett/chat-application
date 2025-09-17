import RecentChat from "@features/chat/components/RecentChat";
import SearchSection from "@common/components/SearchSection";
import AllChat from "@features/chat/components/AllChat";

const Index = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-4 h-screen">
                <div className="grid grid-cols-4 gap-2">
                    <div className="sidebar-menu"></div>
                    <div className="col-span-3 bg-backgroundSidebar pt-3 px-5 py-2.5">
                        <div className="chat-search-header">
                            <div className="flex items-center justify-between mb-3 text-white">
                                <h4 className="font-bold text-xl text-black">Chats</h4>
                                <div className="flex items-center ml-2">
                                    <div className="size-5 p-1 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer mr-3">
                                        <i className="fa-solid fa-plus text-sm text-white"></i>
                                    </div>
                                    <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
                                </div>
                            </div>
                        </div>
                        <SearchSection />
                        <RecentChat />
                        <AllChat />
                        
                    </div>
                </div>
                <div className="col-span-2">

                </div>
            </div>
        </>
    );
};
export default Index