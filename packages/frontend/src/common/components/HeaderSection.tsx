
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores/chat-app.store';
import { toggleInvite } from '@/stores/slices/chatUiSlice';
import type { HeaderSection } from '@/types/header-section';

const HeaderSection = ({title}: HeaderSection) => {
    const dispatch = useDispatch();
    const isToggleInvite = useSelector((state: RootState) => state.chatUi.isToggleInvite);

    const handleToggleInvite = () => {
        dispatch(toggleInvite());
    };

    return (
        <div className="chat-search-header relative mb-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-xl text-black">{title}</h4>
                <div className="flex items-center ml-2">
                    <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer mr-3">
                        <i className="fa-solid fa-plus text-sm text-white"></i>
                    </div>
                    <div className="cursor-pointer" onClick={handleToggleInvite}>
                        <i className="fal fa-solid fa-ellipsis-vertical text-gray-1 text-sm"></i>
                    </div>
                </div>
            </div>

            {/* Invite Others Dropdown */}
            {isToggleInvite && (
                <div className="absolute w-auto bg-white text-black rounded-md z-[100] right-0 p-3 border border-gray-2 shadow-[0_1px_5px_1px_#f3f3f3] text-sm">
                    <div
                        className="flex items-center justify-center rounded-lg cursor-pointer py-2 px-3 hover:text-purple-1 hover:bg-purple-2"
                        onClick={handleToggleInvite}
                    >
                        <i className="fa-regular fa-paper-plane mr-2"></i>
                        <span>Invite Others</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderSection;