import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';
import { useGeminiAi } from '@/common/hooks/useGeminiAi';
import HeaderSection from '@/common/components/HeaderSection';
import SearchSection from '@/common/components/SearchSection';

const Gemini = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { messages, input, isTyping, setInput, sendMessage } = useGeminiAi();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return (
        <>
            <div className='chat-search-header relative mb-4'>
                <HeaderSection title="Chats" />
                {/* Search Box */}
                <SearchSection />
                <div className="chat-tabs">
                    <div className="flex flex-col h-screen mx-auto p-4">
                        {/* Message list */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                            ))}
                            {/* Scroll anchor */}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input box */}
                        <div className="flex gap-2 p-2 border rounded-xl shadow-sm">
                            <input
                                className="flex-1 outline-none"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                                placeholder="Can I help you with something?"
                                disabled={isTyping}
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={isTyping}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                            >
                                {isTyping ? 'Typing...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Gemini;