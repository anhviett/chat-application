import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem('access_token');
    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export default PrivateRoute;
