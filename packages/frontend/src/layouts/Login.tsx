import { useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

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
    const [inputs, setInputs] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');
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
        // Perform login logic here
        try {
            const data = await authApi.login(inputs);
            localStorage.setItem('access_token', data.access_token);
            navigate('/');
        } catch (error) {
            console.log("🚀 ~ handleSubmit ~ error:", error)
        }
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
                                        htmlFor="username"
                                        className="text-sm font-medium text-gray-900 block mb-2"
                                    >
                                        User Name
                                    </label>
                                    <div className="relative">
                                        <i className="fa-solid fa-user text-gray-500 text-sm absolute top-0 left-0 p-2"></i>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md h-9 block w-full pl-6"
                                            value={inputs.username || ""}
                                            onChange={handleChange}
                                            required
                                        />
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
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md h-9 block w-full pl-6"
                                            value={inputs.password || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="bg-gray-50 border border-gray-300 size-4 rounded-md"
                                                required
                                            />
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
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Login
                                </button>
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
                    <div className=""></div>
                </div>
            </div>
        </>
    );
};
export default Login