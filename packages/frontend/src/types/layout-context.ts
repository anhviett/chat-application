// 📥 DEFINE CONTEXT TYPE - TypeScript interface cho context từ MainLayout
export type LayoutContextType = {
    chatThreadId?: number;
    setChatThreadId: (id: number | undefined) => void;
    isToggleInvite: boolean;
    handleToggleInvite: () => void;
    handleToggleInfoWindow: () => void;
};