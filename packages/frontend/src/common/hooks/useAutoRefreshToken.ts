import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTokenTimeRemaining, isTokenValid } from '@/common/utils/tokenUtils';

/**
 * Hook tự động refresh token khi sắp hết hạn
 */
export const useAutoRefreshToken = () => {
    const { accessToken, refreshAccessToken, logout } = useAuth();
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!accessToken || !isTokenValid(accessToken)) {
            return;
        }

        // Clear existing timeout
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        // Tính thời gian còn lại đến khi token hết hạn
        const timeRemaining = getTokenTimeRemaining(accessToken);
        
        // Refresh token trước 5 phút khi hết hạn
        const refreshTime = Math.max(0, timeRemaining - 5 * 60 * 1000);

        console.log(`Token will be refreshed in ${refreshTime / 1000} seconds`);

        refreshTimeoutRef.current = setTimeout(async () => {
            try {
                console.log('Auto-refreshing token...');
                await refreshAccessToken();
            } catch (error) {
                console.error('Auto-refresh token failed:', error);
                logout();
            }
        }, refreshTime);

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [accessToken, refreshAccessToken, logout]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);
};
