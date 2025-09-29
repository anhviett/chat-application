import React from 'react';

type ConversationProps = {
    chatThreadId?: number
}

const messages = [
    { id: 'm1', author: 'other', text: 'Hey there! How are you?', time: '10:24 AM', avatar: 'https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg' },
    { id: 'm2', author: 'me', text: "I'm good, thanks! Working on the chat UI.", time: '10:25 AM' },
    { id: 'm3', author: 'other', text: 'Nice! The layout looks great already.', time: '10:26 AM', avatar: 'https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg' },
    { id: 'm4', author: 'me', text: "I'll push more updates soon.", time: '10:26 AM' },
];

const Conversation: React.FC<ConversationProps> = ({ chatThreadId }) => {
    return (
        <div className="flex flex-col h-full bg-backgroundSidebar">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222224]">
                <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full mr-3" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Avatar" />
                    <div>
                        <p className="text-white font-semibold leading-tight">
                            {
                                chatThreadId !== null && chatThreadId !== undefined ? (
                                    <span className="text-description text-xs">Laverty {chatThreadId}</span>
                                ) : null
                            }
                        </p>
                        <span className="text-description text-xs">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                    <i className="fa-solid fa-phone text-sm cursor-pointer"></i>
                    <i className="fa-solid fa-video text-sm cursor-pointer"></i>
                    <i className="fa-solid fa-ellipsis-vertical text-sm cursor-pointer"></i>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.author === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {m.author !== 'me' && (
                            <img className="w-8 h-8 rounded-full mr-2 mt-1" src={m.avatar} alt="Avatar" />
                        )}
                        <div>
                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${m.author === 'me' ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-[#0d0d0d] text-white rounded-bl-sm'}`}>
                                <p className="text-sm leading-relaxed">{m.text}</p>
                            </div>
                            <div className={`mt-1 text-[10px] text-description ${m.author === 'me' ? 'text-right' : 'text-left'}`}>{m.time}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-3 border-t border-[#222224]">
                <div className="flex items-center gap-2">
                    <button className="text-white/80 hover:text-white"><i className="fa-regular fa-face-smile"></i></button>
                    <button className="text-white/80 hover:text-white"><i className="fa-solid fa-paperclip"></i></button>
                    <input className="flex-1 bg-backgroundInput text-white text-sm px-3 py-2 rounded-md outline-none placeholder:text-description" placeholder="Type your message..." />
                    <button className="bg-violet-600 text-white px-3 py-2 rounded-md text-sm"><i className="fa-solid fa-paper-plane mr-1"></i>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Conversation;


