import { useState } from 'react';

type TabKey = 'profile' | 'media' | 'links' | 'settings';

type InfoWindowProps = {
    chatThreadId?: string;
    onClose?: () => void;
}

const InfoWindow = ({ chatThreadId, onClose }: InfoWindowProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    return (
        <div className="h-full bg-backgroundSidebar border-l border-[#222224]">
            <div className="sticky top-0 z-10 bg-backgroundSidebar border-b border-[#222224]">
                <div className="px-4 py-3 flex items-center justify-between">
                    <h5 className="text-white font-bold text-lg">Contact Info</h5>
                    <i onClick={onClose} className="fa-solid fa-xmark text-white text-sm cursor-pointer"></i>
                </div>
                <div className="px-2 pb-2">
                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => setActiveTab('profile')} className={`text-xs px-2 py-2 rounded-md ${activeTab === 'profile' ? 'bg-violet-600 text-white' : 'text-white/80 hover:text-white'}`}>Profile</button>
                        <button onClick={() => setActiveTab('media')} className={`text-xs px-2 py-2 rounded-md ${activeTab === 'media' ? 'bg-violet-600 text-white' : 'text-white/80 hover:text-white'}`}>Media</button>
                        <button onClick={() => setActiveTab('links')} className={`text-xs px-2 py-2 rounded-md ${activeTab === 'links' ? 'bg-violet-600 text-white' : 'text-white/80 hover:text-white'}`}>Links</button>
                        <button onClick={() => setActiveTab('settings')} className={`text-xs px-2 py-2 rounded-md ${activeTab === 'settings' ? 'bg-violet-600 text-white' : 'text-white/80 hover:text-white'}`}>Settings</button>
                    </div>
                </div>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-96px)]">
                {activeTab === 'profile' && (
                    <div>
                        <div className="flex flex-col items-center text-center">
                            <img className="w-20 h-20 rounded-full mb-3" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Avatar" />
                            <h6 className="text-white font-semibold">
                                {chatThreadId !== null && chatThreadId !== undefined ? (
                                    <span className="text-description text-xs">Laverty {chatThreadId}</span>
                                ) : null}
                            </h6>
                            <p className="text-description text-sm">Online</p>
                        </div>
                        <div className="mt-6">
                            <h6 className="text-white font-semibold mb-2">About</h6>
                            <p className="text-description text-sm">If you can't beat 'em, join 'em.</p>
                        </div>
                        <div className="mt-6">
                            <h6 className="text-white font-semibold mb-2">Social</h6>
                            <div className="flex gap-4 text-white justify-center">
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
                                    <p className="text-description text-xs">Shared on 10:2{i} AM</p>
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
    );
};

export default InfoWindow;
