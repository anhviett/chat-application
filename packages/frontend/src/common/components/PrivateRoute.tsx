import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/common/components/LoadingSpinner';
import { isTokenValid, isTokenExpiringSoon } from '@/common/utils/tokenUtils';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { accessToken, refreshAccessToken, logout, loading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (loading) return; // Wait until AuthProvider is done initializing

        const checkAuth = async () => {
            // Nếu có accessToken, kiểm tra tính hợp lệ
            if (accessToken) {
                try {
                    if (!isTokenValid(accessToken)) {
                        // Token hết hạn, thử refresh
                        console.log('Access token expired, attempting refresh...');
                        await refreshAccessToken();
                        setIsAuthenticated(true);
                    } else if (isTokenExpiringSoon(accessToken)) {
                        // Token sắp hết hạn, refresh proactively
                        console.log('Access token expiring soon, refreshing...');
                        try {
                            await refreshAccessToken();
                        } catch (error) {
                            console.warn('Proactive refresh failed, but token still valid:', error);
                        }
                        setIsAuthenticated(true);
                    } else {
                        // Token còn hạn
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Token validation failed:', error);
                    logout();
                    setIsAuthenticated(false);
                }
            } else {
                // Không có token, thử refresh từ localStorage
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        await refreshAccessToken();
                        setIsAuthenticated(true);
                    } catch (error) {
                        console.error('Token refresh failed:', error);
                        logout();
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            }
            setIsChecking(false);
        };

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    // Hiển thị loading khi đang kiểm tra auth
    if (isChecking) {
        return <LoadingPage message="Checking authentication..." />;
    }

    // Redirect đến login nếu chưa authenticate
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
