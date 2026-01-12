import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { AuthContextType } from '@/types/auth-context';
import type { UserType } from '@/types/user-type';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Load from Local Storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedUser && storedToken) {
            setAccessToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

    }, []);

    const login = (token: string, refreshToken: string, userData: UserType) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setAccessToken(token);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
        window.location.href = '/login'; // redirect to login page
    }    
    const refreshAccessToken = async (): Promise<string> => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Handle mock refresh token
        if (refreshToken === 'mock-refresh-token') {
            const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds
            const newMockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: 1, name: 'test', exp: expirationTime }))}.mock-signature`;
            localStorage.setItem('accessToken', newMockToken);
            setAccessToken(newMockToken);
            return newMockToken;
        }

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            
            // Update localStorage and state
            localStorage.setItem('accessToken', data.accessToken);
            setAccessToken(data.accessToken);
            
            // Optionally update refresh token if provided
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            
            return data.accessToken;
        } catch (error) {
            console.error('Failed to refresh token', error);
            logout();
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}