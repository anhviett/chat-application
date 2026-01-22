import HeaderSection from '@/common/components/HeaderSection';
import SearchSection from '@/common/components/SearchSection';

const Gemini = () => {
    return (
        <>
            <div className='chat-search-header relative mb-4'>
                <HeaderSection title="Chats" />
                {/* Search Box */}
                <SearchSection />
            </div>
        </>
    );
}

export default Gemini;