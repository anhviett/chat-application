import { useUserList } from "@/common/hooks/useUserList";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './style.css'

const RecentChat = () => {
    const { users } = useUserList();
    const slideData = [
      { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 3, name: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 4, name: 'Emily Brown', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: 5, name: 'Michael Lee', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: 6, name: 'Jessica Jones', avatar: 'https://i.pravatar.cc/150?img=6' },
    ];

    return (
        <>
            <div className="top-online-contacts relative mb-4">
                <div className="flex justify-between py-4">
                    <h5 className="font-bold text-xl text-black">Recent Chats</h5>
                </div>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={'auto'}
                    freeMode={true}
                    watchSlidesProgress={true}
                    className='online-contact-slider'
                >
                    {users.map((slide) => (
                        <SwiperSlide key={slide.id} style={{ width: 'auto' }}>
                            <div className="flex flex-col">
                                <div className="text-center size-12 relative before:content-[''] before:absolute before:bg-active before:size-3 before:rounded-full before:right-0 before:bottom-0 before:border-2 before:border-white">
                                    <img src={slide.avatar} alt={slide.name} className="rounded-full mx-auto" />
                                </div>
                                <p className="text-sm text-gray-1 mt-2">{slide.name}</p>
                            </div>
                            
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
};

export default RecentChat;