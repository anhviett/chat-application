import React from 'react';

type SidebarMenuProps = {
    onOpenInfoTab?: (tab: 'profile' | 'media' | 'links' | 'settings') => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onOpenInfoTab }) => {
    return (
        <div className="h-full bg-backgroundSidebar border-r border-[#222224] flex flex-col items-center py-4 gap-6 w-20">
            <a href="/" className="text-white" title="Home">
                <img className="w-10 h-10" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/logo.png" alt="Logo" />
            </a>
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


