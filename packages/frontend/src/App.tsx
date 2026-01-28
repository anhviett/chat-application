import PrivateRoute from "@/common/components/PrivateRoute";
import ErrorBoundary from "@/common/components/ErrorBoundary";
import Login from "@/layouts/Login";
import Logout from "@/layouts/Logout";
import Register from "@/layouts/Register";
import Chat from "@/pages/chat/Index";
import Contact from "@/pages/contacts/Index";
import Setting from "@/pages/settings/Index";
import Profile from "@/pages/profile/Index";
import Group from "@/pages/groups/Index";
import Status from "@/pages/status/Index";
import Gemini from "@/pages/gemini/Index";
import SidebarMenu from "@/features/chat/components/SidebarMenu";
import InfoWindow from "@/features/chat/components/InfoWindow";
import Conversation from "@/features/chat/components/Conversation";
import ChatDefault from "@/features/chat/components/ChatDefault";
import { TypingProvider } from "@/contexts/TypingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAutoRefreshToken } from "@/common/hooks/useAutoRefreshToken";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/chat-app.store";
import {
  setChatThread,
} from "@/stores/slices/chatUiSlice";
import { socket } from "@/sockets/index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { SendMessage } from "@/types/message-type";

// Layout Component với 3 cột cố định
const MainLayout = () => {
  // Auto refresh token khi user đang sử dụng app
  useAutoRefreshToken();

  const location = useLocation();
  const currentPath = location.pathname;

  // 📦 STATE - Quản lý global layout state qua Redux
  const dispatch = useDispatch();
  const chatThread = useSelector((state: RootState) => state.chatUi.chatThread);
  const isInfoWindowOpen = useSelector(
    (state: RootState) => state.chatUi.isInfoWindowOpen,
  );
  const [, setMessages] = useState<SendMessage[]>([]);
  useEffect(() => {
    const handleIncomingMessage = (data: SendMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, []);

  // 🔄 RESET STATE khi chuyển route (trừ khi ở /chat)
  useEffect(() => {
    if (currentPath !== "/" && currentPath !== "/chat") {
      dispatch(setChatThread(undefined));
    }
  }, [currentPath, dispatch]);

  // Đã khai báo dispatch phía trên, không cần lặp lại

  return (
    <TypingProvider>
      <div className="h-screen overflow-hidden">
        {/* Sidebar Menu - Cố định bên trái (72px) - Ẩn trên mobile */}
        <div className="w-[72px] h-full fixed left-0 top-0 z-50 hidden lg:block">
          <SidebarMenu />
        </div>

        {/* Main Content Area - 3 cột layout */}
        <div className="flex-1 lg:ml-[72px] h-full overflow-hidden">
          <div className="relative flex h-full">
            {/* 
              📍 CỘT 1: SIDEBAR COMPONENT
              Mobile: Ẩn khi có chatThread hoặc InfoWindow mở
              Desktop: Luôn hiển thị với width cố định
            */}
            <div
              className={`h-full bg-backgroundSidebar border-r border-gray-2 flex-shrink-0
              ${chatThread || isInfoWindowOpen ? "hidden lg:block" : "w-full"}
              lg:w-[320px] xl:w-[380px]
            `}
            >
              <div className="pt-3 px-3 py-2.5 h-full">
                <Outlet />
              </div>
            </div>

            {/* 
              📍 CỘT 2: MAIN CONTENT (Conversation)
              Mobile: Full width khi có chatThread, ẩn khi không có
              Desktop: Flex-1 để chiếm phần còn lại
            */}
            <div
              className={`h-full flex-1 min-w-0 ${!chatThread ? "hidden lg:block" : "w-full lg:w-auto"} ${isInfoWindowOpen ? "hidden lg:block" : ""}`}
            >
              {chatThread ? <Conversation /> : <ChatDefault />}
            </div>

            {/* 
              📍 CỘT 3: INFO WINDOW
              Mobile: Full width khi mở
              Desktop: Width cố định bên phải
            */}
            {isInfoWindowOpen && (
              <div className="h-full flex-shrink-0 w-full lg:w-[320px] xl:w-[380px] border-l border-gray-2">
                <InfoWindow />
              </div>
            )}
          </div>
        </div>
      </div>
    </TypingProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes có Sidebar + Main Content (3 cột) - Bảo vệ bởi PrivateRoute */}
            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/group" element={<Group />} />
              <Route path="/status" element={<Status />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/gemini" element={<Gemini />} />
            </Route>

            {/* Routes không có Sidebar (Login/Register) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
