import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css';
import './style.css'

const RecentChat = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <>
            <div className="top-online-contacts relative">
                <div className="flex justify-between py-4">
                    <h5 className="mb-3 font-bold text-xl text-white">Recent Chats</h5>
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white font-medium rounded-lg text-sm pb-2.5"
                        onClick={toggleDropdown}
                        type="button">
                        <i className="fa-solid fa-ellipsis-vertical text-sm pl-2"></i>
                    </button>
                </div>
                <div id="dropdown" className={`${isDropdownOpen ? 'block' : 'hidden'} absolute top-1/2 z-10 px-4 py-3 right-0 bg-backgroundInput border border-solid border-[#222224] rounded-lg shadow-sm`}>
                    <ul className="py-2 text-sm " aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a href="#" className="block bg-backgroundSidebar mb-1 px-4 py-2 text-white">Dashboard</a>
                        </li>
                        <li>
                            <a href="#" className="block bg-backgroundSidebar px-4 py-2 text-white">Settings</a>
                        </li>
                    </ul>
                </div>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                            <div className="rounded-full online mb-2">
                                <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Image" />
                            </div>
                            <p className='text-sm'>Laverty</p>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                            <div className="rounded-full online mb-2">
                                <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Image" />
                            </div>
                            <p className='text-sm'>Laverty</p>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                            <div className="rounded-full online mb-2">
                                <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Image" />
                            </div>
                            <p className='text-sm'>Laverty</p>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                            <div className="rounded-full online mb-2">
                                <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Image" />
                            </div>
                            <p className='text-sm'>Laverty</p>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <a className="text-center bg-backgroundSidebar text-white" href="/react/template/chat">
                            <div className="rounded-full online mb-2">
                                <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/profiles/avatar-15.jpg" alt="Image" />
                            </div>
                            <p className='text-sm'>Laverty</p>
                        </a>
                    </SwiperSlide>
                </Swiper>
            </div >
        </>
    );
}

export default RecentChat;