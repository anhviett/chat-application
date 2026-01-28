import { useUserList } from "@/common/hooks/useUserList";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./style.css";
import AvatarMan from "@/assets/images/avatar-man.png";
import AvatarFemale from "@/assets/images/avatar-female.webp";
import { useConversations } from "@/common/hooks/useConversations";
import { setChatThread } from "@/stores/slices/chatUiSlice";
import { useDispatch } from "react-redux";

const RecentChat = () => {
  const dispatch = useDispatch();
  const { users } = useUserList();
  const { conversations, fetchConversation } = useConversations();

  const handleSelectChat = async (user: { _id: string; name: string }) => {
    await fetchConversation(user._id);
    const existingConv = conversations.find(
      (c) => c.participantId === user._id || c._id === user._id,
    );
    if (existingConv) {
      dispatch(
        setChatThread({
          recipientId: user._id,
          name: user.name,
          conversationId: existingConv._id || existingConv.id,
        }),
      );
    } else {
      dispatch(
        setChatThread({
          recipientId: user._id,
          name: user.name,
          conversationId: undefined,
        }),
      );
    }
  };

  return (
    <>
      <div className="top-online-contacts relative mb-4">
        <div className="flex justify-between py-4">
          <h5 className="font-bold text-xl text-black">Recent Chats</h5>
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={"auto"}
          freeMode={true}
          watchSlidesProgress={true}
          className="online-contact-slider"
        >
          {users.map((slide) => (
            <SwiperSlide key={slide._id} style={{ width: "auto" }}>
              <div
                className="flex flex-col"
                onClick={() =>
                  handleSelectChat({ _id: slide._id, name: slide.name })
                }
              >
                <div className="text-center size-12 cursor-pointer relative before:content-[''] before:absolute before:bg-active before:size-3 before:rounded-full before:right-0 before:bottom-0 before:border-2 before:border-white">
                  <img
                    src={slide.gender ? AvatarFemale : AvatarMan}
                    alt={`${slide.firstName} ${slide.lastName}`}
                    className="rounded-full mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-1 mt-2">
                  {slide.firstName} {slide.lastName}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default RecentChat;
