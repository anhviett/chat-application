import RecentChat from "@/features/chat/components/RecentChat";
import AllChat from "@/features/chat/components/AllChat";
import HeaderSection from "@/common/components/HeaderSection";
import SearchSection from "@/common/components/SearchSection";

const Chat = () => {
  return (
    <>
      <HeaderSection title="Chats" />
      {/* Search Box */}
      <SearchSection />

      {/* Chat Tabs */}
      <div className="chat-tabs">
        <RecentChat />
        <AllChat />
      </div>
    </>
  );
};

export default Chat;
