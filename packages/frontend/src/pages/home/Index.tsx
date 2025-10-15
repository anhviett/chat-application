import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "@/sockets/index";
import Chat from "@/pages/chat/Index";
import Contact from "@/pages/contacts/Index";
import Profile from "@/pages/profile/Index";
import Group from "@/pages/groups/Index";
import Setting from "@/pages/settings/Index";
import Status from "@/pages/status/Index";

const Home = () => {
    // 📍 DETECT ACTIVE ROUTE - Nhận biết đang ở route nào
    const location = useLocation();
    const currentPath = location.pathname; // VD: "/chat", "/contact", "/profile"

    // 🔌 SOCKET CONNECTION
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    // 🎨 RENDER SIDEBAR COMPONENT - Hiển thị component tương ứng với route
    const renderSidebarContent = () => {
        switch (currentPath) {
            case '/':
            case '/chat':
                return <Chat />;
            case '/contact':
                return <Contact />;
            case '/profile':
                return <Profile />;
            case '/group':
                return <Group />;
            case '/status':
                return <Status />;
            case '/setting':
                return <Setting />;
            default:
                return <Chat />;
        }
    };

    return (
        <>
            {/* Sidebar Content - Render component dựa vào route */}
            {renderSidebarContent()}
        </>
    );
};

export default Home;