import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css';
import './style.css'

const RecentChat = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const slideData = [
      { id: 1, name: 'Slide 1', content: 'Content for slide 1' },
      { id: 2, name: 'Slide 2', content: 'Content for slide 2' },
      { id: 3, name: 'Slide 3', content: 'Content for slide 3' },
      { id: 4, name: 'Slide 3', content: 'Content for slide 4' },
      { id: 5, name: 'Slide 3', content: 'Content for slide 5' },
    ];

    return (
        <>
            <div className="top-online-contacts relative">
                <div className="flex justify-between py-4">
                    <h5 className="mb-3 font-bold text-xl text-black">Recent Chats</h5>
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="px-3 text-black font-medium rounded-lg text-sm pb-2.5"
                        onClick={toggleDropdown}
                        type="button">
                        <i className="fa-solid fa-ellipsis-vertical text-sm pl-2"></i>
                    </button>
                </div>
                <div id="dropdown" className={`${isDropdownOpen ? 'block' : 'hidden'} absolute top-1/2 z-10 px-4 py-3 right-0 border border-solid rounded-lg shadow-sm` + " bg-white"}>
                    <ul className="py-2 text-sm " aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a href="#" className="block hover:bg-ovilet-500 mb-1 px-4 py-2 text-black">Dashboard</a>
                        </li>
                        <li>
                            <a href="#" className="block hover:bg-ovilet-500 px-4 py-2 text-black">Settings</a>
                        </li>
                    </ul>
                </div>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    className="mySwiper"
                >
                    {
                        slideData.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                                    <div className="rounded-full online mb-2">
                                        <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/src/assets/img/profiles/avatar-15.jpg" alt="Image" />
                                    </div>
                                    <p className='text-sm text-gray-500'>{slide.name}</p>
                                </a>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div >
        </>
    );
}

export default RecentChat;