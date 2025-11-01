import type { UserType } from '@/types/user-type';

export interface AuthContextType {
    user: UserType | null;
    accessToken: string | null;
    login: (accessToken: string, refreshToken: string, user: UserType) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<string>;
}