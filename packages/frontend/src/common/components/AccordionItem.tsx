
import type { AccordionItem } from '@/types/accordion-item';

const AccordionItem = ({ 
    icon, 
    title, 
    content, 
    children, // ✅ Giống như <slot> trong Vue
    isOpen, 
    onClick 
}: AccordionItem) => {
    return (
        <li className="relative border-b border-gray-200">
            <button
                type="button"
                className="w-full px-6 py-6 text-left"
                onClick={onClick}
            >
                <div className="flex items-center justify-between">
                    {/* ✅ Icon có thể là string hoặc custom JSX */}
                    {icon && <span className="mr-3">{icon}</span>}
                    
                    {/* ✅ Title có thể là string hoặc custom JSX */}
                    <span className="flex-1">{title}</span>
                    
                    {/* Arrow icon */}
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''
                            }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
            {/* ✅ Content area - ưu tiên children (slot), fallback là content */}
            <div
                className={`relative overflow-hidden transition-all duration-700 ${isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <div className="px-6 pb-6">
                    {/* ✅ Nếu có children thì dùng children (giống slot default Vue) */}
                    {/* ✅ Nếu không có children thì dùng content prop */}
                    {children ? children : <p>{content}</p>}
                </div>
            </div>
        </li>
    );
}

export default AccordionItem;