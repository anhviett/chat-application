import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'
import { UserType } from '@/types/user-type';
import { LoginInputs } from '@/types/login-input';
import Button from '@/common/components/Button';
import InputCustom from '@/common/components/InputCustom';

function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp là thời gian hết hạn (tính bằng giây)
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

const Login = () => {
    const { login } = useAuth();
    const [inputs, setInputs] = useState<LoginInputs>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (isTokenValid(token)) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Mock user data for successful login
        const mockUser: UserType = {
            id: 1,
            email: inputs.email || 'user@example.com',
            username: inputs.email?.split('@')[0] || 'user',
            firstName: 'Test',
            lastName: 'User',
            image: 'https://api.example.com/avatar.jpg',
        };

        // Mock tokens with proper expiration (24 hours from now)
        const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds
        const mockAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: 1, name: 'test', exp: expirationTime }))}.mock-signature`;
        const mockRefreshToken = 'mock-refresh-token';

        // Sử dụng AuthContext để lưu thông tin đăng nhập
        login(mockAccessToken, mockRefreshToken, mockUser);

        // Redirect to dashboard
        navigate('/');
    }

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-2 gap-6">
                    {/* component */}
                    {/* This is an example component */}
                    <div className="flex flex-col justify-center items-center h-screen w-full">
                        <div className="mx-auto mb-5 text-center">
                            <img className="img-fluid" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/full-logo.svg" alt="Logo" />
                        </div>
                        <div className="w-full mt-5 bg-white shadow-md border border-gray-200 rounded-lg max-w-lg p-4 sm:p-6">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <h3 className="text-3xl text-dark font-bold text-gray-900">
                                        Welcome!
                                    </h3>
                                    <p className="mt-1 text-md text-gray-1">Sign in to see what you’ve missed.</p>
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-900 block mb-2"
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <i className="fa-solid fa-user text-gray-500 text-sm absolute top-0 left-0 p-2"></i>
                                        <InputCustom type="email" name="email" value={inputs.email || ""} onChange={handleChange} placeholder="Enter your email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md h-9 block w-full pl-6" required />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-900 block mb-2"
                                    >
                                        Your password
                                    </label>
                                    <div className='relative'>
                                        <i
                                            onClick={togglePassword}
                                            className="fa-solid fa-eye cursor-pointer text-gray-500 text-sm absolute top-0 left-0 p-2"></i>
                                        <InputCustom type={showPassword ? 'text' : 'password'} name="password" value={inputs.password || ""} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md h-9 block w-full pl-6" required />
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <InputCustom type='checkbox' id="remember" className='bg-gray-50 border border-gray-300 size-4 rounded-md' />
                                        </div>
                                        <div className="text-sm ml-3">
                                            <label
                                                htmlFor="remember"
                                                className="text-black cursor-pointer"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="text-sm text-blue-700 hover:underline ml-auto"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                                {/* <input
                                    type="hidden"
                                    name="expiresInMins"
                                    id="expiresInMins"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md h-9 block w-full pl-6"
                                    value={inputs.expiresInMins || 24 * 3600}
                                    onChange={handleChange}
                                    required
                                /> */}
                                <Button variant="primary" size="medium" fullWidth type='submit'>Login</Button>
                                <div className="text-sm font-medium text-gray-500">
                                    Not registered?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-700 hover:underline"
                                    >
                                        Create account
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Login