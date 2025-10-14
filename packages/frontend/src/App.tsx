import PrivateRoute from '@components/PrivateRoute';
import Home from '@pages/home/Index';
import Login from '@layouts/Login';
import Contact from '@pages/contacts/Index';
import Setting from '@pages/settings/Index';
import Profile from '@pages/profile/Index';
import Group from '@pages/groups/Index';
import Status from '@pages/status/Index';
import SidebarMenu from '@features/chat/components/SidebarMenu';
import { TypingProvider } from '@contexts/TypingContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from 'react-router-dom';

// Layout Component với Sidebar cố định
const MainLayout = () => {
  return (
    <TypingProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Menu - Cố định bên trái */}
        <div className="w-[72px] h-full fixed left-0 top-0 z-50">
          <SidebarMenu />
        </div>
        
        {/* Main Content - Bù khoảng trống cho Sidebar */}
        <div className="flex-1 ml-[72px] h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </TypingProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes có Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/group" element={<Group />} />
          <Route path="/status" element={<Status />} />
          <Route path="/setting" element={<Setting />} />
        </Route>

        {/* Routes không có Sidebar (Login) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
