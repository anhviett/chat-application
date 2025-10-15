import Button from '@/common/components/Button';

import { useState } from 'react';

type TabKey = 'profile' | 'media' | 'links' | 'settings';

type InfoWindowProps = {
    chatThreadId?: string;
    onClose?: () => void;
}

const InfoWindow = ({ chatThreadId, onClose }: InfoWindowProps) => {
    const [activeTab,] = useState<TabKey>('profile');

    return (
        chatThreadId && (
            <div className="h-full bg-backgroundSidebar">
                <div className="sticky top-0 z-10 bg-backgroundSidebar border-b border-gray-2 py-2.5">
                    <div className="px-4 py-3 flex items-center justify-between h-full">
                        <h5 className="text-black font-bold text-xl w-full flex items-center justify-between">
                            Contact Info
                            <Button className="text-gray-1 hover:bg-red-1 hover:text-white flex items-center justify-center h-6 w-6 rounded-full" onClick={onClose}>
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </Button>
                        </h5>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-96px)]">
                    {activeTab === 'profile' && (
                        <div>
                            <div className="flex flex-col items-center text-center">
                                <img className="w-20 h-20 rounded-full mb-3" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Avatar" />
                                <h6 className="text-white font-semibold">
                                    {chatThreadId !== null && chatThreadId !== undefined ? (
                                        <span className="text-black text-base">Laverty {chatThreadId}</span>
                                    ) : null}
                                </h6>
                                <p className="text-gray-1 text-sm">Online</p>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center text-black rounded-md text-sm py-2 bg-white shadow-[0_1px_5px_1px_#f3f3f3]">
                                    <a className="action-wrap" href="/react/template/chat"><i className="fa-solid fa-phone text-sm text-purple-1 cursor-pointer"></i><p>Audio</p></a>
                                </div>
                                <div className="text-center text-black rounded-md text-sm py-2 bg-white shadow-[0_1px_5px_1px_#f3f3f3]">
                                    <a className="action-wrap" href="/react/template/chat"><i className="fa-solid fa-video text-sm text-purple-1 cursor-pointer"></i><p>Video</p></a>
                                </div>
                                <div className="text-center text-black rounded-md text-sm py-2 bg-white shadow-[0_1px_5px_1px_#f3f3f3]">
                                    <a className="action-wrap" href="/react/template/chat"><i className="fa-solid fa-paperclip text-sm text-purple-1 cursor-pointer"></i><p>File</p></a>
                                </div>
                                <div className="text-center text-black rounded-md text-sm py-2 bg-white shadow-[0_1px_5px_1px_#f3f3f3]">
                                    <a className="action-wrap" href="/react/template/chat"><i className="fa-solid fa-search text-sm text-purple-1 cursor-pointer"></i><p>Search</p></a>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h6 className="text-black font-semibold mb-2">Profile Info</h6>
                                <div className="mb-3 bg-white rounded-md shadow-[0_1px_5px_1px_#f3f3f3] border border-backgroundSidebar">
                                    <div className="flex-auto">
                                        <ul className='flex flex-col gap-3 p-4 text-sm rounded-[6px]'>
                                            <li>
                                                <div className="flex py-4">
                                                    <div className="profile-info">
                                                        <h6 className='text-black font-semibold text-sm'>Name</h6>
                                                        <p className='text-base text-gray-1'>Edward Lietz</p>
                                                    </div>
                                                </div>
                                                <div className="flex py-4 border-t border-gray-2">
                                                    <div className="profile-info">
                                                        <h6 className='text-black font-semibold text-sm'>Email Address</h6>
                                                        <p className='text-base text-gray-1'>info@example.com</p>
                                                    </div>
                                                </div>
                                                <div className="flex py-4 border-t border-gray-2">
                                                    <div className="profile-info">
                                                        <h6 className='text-black font-semibold text-sm'>Phone</h6>
                                                        <p className='text-base text-gray-1'>555-555-21541</p>
                                                    </div>
                                                </div>
                                                <div className="flex py-4 border-t border-gray-2">
                                                    <div className="profile-info">
                                                        <h6 className='text-black font-semibold text-sm'>Bio</h6>
                                                        <p className='text-base text-gray-1'>Hello, I am using DreamsChat</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h6 className="text-black font-semibold mb-2">Social</h6>
                                <div className="flex gap-4 text-black justify-center">
                                    <a href="#" className="text-lg"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="text-lg"><i className="fab fa-twitter"></i></a>
                                    <a href="#" className="text-lg"><i className="fab fa-instagram"></i></a>
                                    <a href="#" className="text-lg"><i className="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div>
                            <h6 className="text-white font-semibold mb-3">Shared Media</h6>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <img key={i} className="w-full h-20 object-cover rounded" src={`https://picsum.photos/seed/chatmedia${i}/200/200`} alt="Media" />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div>
                            <h6 className="text-white font-semibold mb-3">Shared Links</h6>
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <a key={i} href="#" className="block">
                                        <p className="text-white text-sm truncate">https://example.com/article-{i}</p>
                                        <p className="text-gray-1 text-xs">Shared on 10:2{i} AM</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <p className='text-white'>Settings content goes here...</p>
                        </div>
                    )}
                </div>
            </div>
        )

    );
};

export default InfoWindow;