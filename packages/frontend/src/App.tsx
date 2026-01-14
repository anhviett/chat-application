import PrivateRoute from '@/common/components/PrivateRoute';
import ErrorBoundary from '@/common/components/ErrorBoundary';
import Login from '@/layouts/Login';
import Logout from '@/layouts/Logout';
import Chat from '@/pages/chat/Index';
import Contact from '@/pages/contacts/Index';
import Setting from '@/pages/settings/Index';
import Profile from '@/pages/profile/Index';
import Group from '@/pages/groups/Index';
import Status from '@/pages/status/Index';
import SidebarMenu from '@/features/chat/components/SidebarMenu';
import InfoWindow from "@/features/chat/components/InfoWindow";
import Conversation from "@/features/chat/components/Conversation";
import ChatDefault from "@/features/chat/components/ChatDefault";
import { TypingProvider } from '@/contexts/TypingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAutoRefreshToken } from '@/common/hooks/useAutoRefreshToken';
import { useState, useEffect } from 'react';
import { socket } from "@/sockets/index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation
} from 'react-router-dom';
import { SendMessage, ChatThread } from '@/types/message-type';

// Layout Component với 3 cột cố định
const MainLayout = () => {
  // Auto refresh token khi user đang sử dụng app
  useAutoRefreshToken();

  const location = useLocation();
  const currentPath = location.pathname;

  // 📦 STATE - Quản lý global layout state
  const [chatThread, setChatThread] = useState<ChatThread | undefined>(undefined);
  const [isInfoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<SendMessage[]>([]);

  useEffect(() => {
    const handleIncomingMessage = (data: SendMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('message', handleIncomingMessage);

    return () => {
      socket.off('message', handleIncomingMessage);
    };
  }, []);

  // 🔄 RESET STATE khi chuyển route (trừ khi ở /chat)
  useEffect(() => {
    if (currentPath !== '/' && currentPath !== '/chat') {
      setChatThread(undefined);
      setInfoWindowOpen(false);
    }
  }, [currentPath]);

  // 🎯 CALLBACK FUNCTIONS
  const handleToggleInfoWindow = () => {
    setInfoWindowOpen(prevState => !prevState);
  };

  return (
    <TypingProvider>
      <div className="h-screen overflow-hidden">
        {/* Sidebar Menu - Cố định bên trái (72px) */}
        <div className="w-0 lg:w-[72px] h-full fixed left-0 top-0 z-50 hidden lg:block">
          <SidebarMenu />
        </div>
        
        {/* Main Content Area - 3 cột layout */}
        <div className="flex-1 ml-0 lg:ml-[72px] h-full overflow-hidden">
          <div className="relative grid grid-cols-12 h-full">
            {/* 
              📍 CỘT 1: SIDEBAR COMPONENT (col-span-3)
              Thay đổi theo route: Chat/Contact/Profile/Group/Status/Setting
            */}
            <div className={`h-full bg-backgroundSidebar border-r border-gray-2 col-span-12 lg:col-span-3 lg:min-w-0 min-w-72 ${isInfoWindowOpen ? 'hidden lg:block' : 'col-span-12 lg:col-span-3'}`}>
              <div className="pt-3 py-2.5 h-full">
                {/* Dynamic routes rendering - Pass state & callbacks as props */}
                <Outlet context={{ 
                  chatThread, 
                  setChatThread, 
                  handleToggleInfoWindow 
                }} />
              </div>
            </div>

            {/* 
              📍 CỘT 2: MAIN CONTENT (col-span-6/9)
              Persistent - Luôn hiển thị như footer
            */}
            <div className={`h-full lg:ml-0 ml-14 ${isInfoWindowOpen ? 'hidden lg:block lg:col-span-6' : 'col-span-9'}`}>
              {!chatThread ? (
                <ChatDefault className={`${isInfoWindowOpen ? '' : 'hidden lg:flex'}`} />
              ) : (
                <Conversation
                  chatThread={chatThread}
                  onContactInfoToggle={handleToggleInfoWindow}
                />
              )}
            </div>

            {/* 
              📍 CỘT 3: INFO WINDOW (col-span-3)
              Persistent - Hiển thị khi isInfoWindowOpen = true
            */}
            {isInfoWindowOpen && (
              <div className={`col-span-12 lg:col-span-3 h-full outline-0 transition min-w-[unset] transform duration-300 ease-in-out ${isInfoWindowOpen ? 'w-full transform-none' : 'w-0'}`}>
                <InfoWindow
                  chatThread={chatThread}
                  onClose={handleToggleInfoWindow}
                />
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
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/group" element={<Group />} />
              <Route path="/status" element={<Status />} />
              <Route path="/setting" element={<Setting />} />
            </Route>

            {/* Routes không có Sidebar (Login) */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
