import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/common/hooks/useAuth";

type SidebarMenuProps = {
  onOpenInfoTab?: (tab: "profile" | "media" | "links" | "settings") => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: "fa-regular fa-message", path: "/chat", title: "Chats" },
    { icon: "fa-solid fa-user-shield", path: "/contact", title: "Contacts" },
    { icon: "fa-solid fa-users", path: "/group", title: "Groups" },
    { icon: "fa-regular fa-circle-dot", path: "/status", title: "Status" },
    { icon: "fa-regular fa-circle-user", path: "/profile", title: "Profile" },
    { icon: "fa-solid fa-gear", path: "/setting", title: "Settings" },
    { icon: "fa-solid fa-robot", path: "/gemini", title: "Gemini" },
  ];

  return (
    <div className="h-full bg-white flex flex-col items-center shadow-[0_1px_5px_1px_#f3f3f3] outline-none border-r border-gray-2 py-4 gap-4">
      {/* Logo */}
      <div className="logo mb-4">
        <Link to="/" title="Home">
          <img
            className="w-10 h-10"
            src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/logo.png"
            alt="Logo"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            title={item.title}
            className={({ isActive }) => `
                            w-12 h-12 flex items-center justify-center rounded-lg
                            transition-all duration-200
                            ${
                              isActive
                                ? "bg-purple-1 text-white"
                                : "text-gray-1 hover:bg-purple-2 hover:text-purple-1"
                            }
                        `}
          >
            <i className={`${item.icon} text-lg`}></i>
          </NavLink>
        ))}
      </nav>

      {/* Profile Menu at Bottom */}
      <div className="mt-auto">
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-2 hover:border-purple-1 transition-all"
          title="My Profile"
          onClick={() => logout()}
        >
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
