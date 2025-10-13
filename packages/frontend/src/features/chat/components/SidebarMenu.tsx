import React from 'react';

type SidebarMenuProps = {
    onOpenInfoTab?: (tab: 'profile' | 'media' | 'links' | 'settings') => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onOpenInfoTab }) => {
    return (
        <div className="h-full bg-white overflow-y-auto shadow-[0_1px_5px_1px_#f3f3f3] border-r border-gray-2 py-4 gap-6">
            <div className="logo">
                <a href="/" className="text-white" title="Home">
                    <img className="w-10 h-10" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/logo.png" alt="Logo" />
                </a>
            </div>
            <div className="menu-wrap">
                <div className="main-menu">
                    <ul className="nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link">Item 1</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">Item 2</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">Item 3</a>
                        </li>
                    </ul>
                </div>
                <div className="profile-menu">

                </div>
            </div>
            <button className="text-white/80 hover:text-white" title="Chats">
                <i className="fa-solid fa-message text-lg"></i>
            </button>
            <button className="text-white/80 hover:text-white" title="Contacts" onClick={() => onOpenInfoTab?.('profile')}>
                <i className="fa-solid fa-user text-lg"></i>
            </button>
            <button className="text-white/80 hover:text-white" title="Shared Media" onClick={() => onOpenInfoTab?.('media')}>
                <i className="fa-regular fa-image text-lg"></i>
            </button>
            <button className="text-white/80 hover:text-white" title="Links" onClick={() => onOpenInfoTab?.('links')}>
                <i className="fa-solid fa-link text-lg"></i>
            </button>
            <button className="text-white/80 hover:text-white mt-auto" title="Settings" onClick={() => onOpenInfoTab?.('settings')}>
                <i className="fa-solid fa-gear text-lg"></i>
            </button>
        </div>
    );
};

export default SidebarMenu;


