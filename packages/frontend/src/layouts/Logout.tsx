import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Logging out...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            </div>
        </div>
    );
};

export default Logout;
