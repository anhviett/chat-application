export type ChatProps = {
    chatThreadId?: number;                                    // ID của thread đang chat
    toggleInvite: boolean;                                    // Trạng thái mở/đóng invite dropdown
    onChatThreadChange: (threadId: number | undefined) => void; // Callback khi chọn thread khác
    onToggleInvite: () => void;                              // Callback khi click invite button
    onContactInfoToggle: () => void;
}