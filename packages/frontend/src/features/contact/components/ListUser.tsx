import { useRef, } from "react";
import { UserType } from "@/types/user-type";
import { useUserList } from "@/common/hooks/useUserList";

const groupUsersByLetter = (users: UserType[]) => {
    const grouped: { [key: string]: UserType[] } = {};
    users.forEach((user) => {
        const letter = user.firstName?.[0].toUpperCase();
        if (!letter) return;
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(user);
    });
    return grouped;
}

export default function ListUser() {
    const { users, loading, error } = useUserList();
    const groupedUsers = groupUsersByLetter(users);
    const letters = Object.keys(groupedUsers).sort();
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const scrollToLetter = (letter: string) => {
        const section = sectionRefs.current[letter];
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // ✅ Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-gray-500">Loading contacts...</div>
            </div>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    // ✅ Empty state
    if (letters.length === 0) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-gray-500">No contacts found</div>
            </div>
        );
    }    return (
        <div className="relative flex h-[80vh] border rounded-lg shadow-md bg-white overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {letters.map((letter) => (
                    <div key={letter} ref={(el) => { sectionRefs.current[letter] = el; }}>
                        <div className="sticky top-0 bg-white text-blue-600 font-bold text-lg py-1 text-nowrap">
                            {letter}
                        </div>
                        <ul>
                            {groupedUsers[letter].map((user) => (                                <li
                                    key={user.id}
                                    className="border-b py-2 px-2 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                                            {user.image ? (
                                                <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Thanh chữ cái A-Z */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center pr-1">
                {letters.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => scrollToLetter(letter)}
                        className="text-xs text-gray-500 hover:text-blue-600 py-[2px] font-semibold transition"
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
}