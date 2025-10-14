import RecentChat from "@features/chat/components/RecentChat";
import SearchSection from "@common/components/SearchSection";
import AllChat from "@features/chat/components/AllChat";
import Chat from "@pages/chat/Index";

const Home = () => {
    return (
        <>
            <div className="wrapper">
                <Chat />
            </div>
        </>
    );
};
export default Home