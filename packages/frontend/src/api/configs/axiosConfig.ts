import axios from "axios"

const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://dummyjson.com';

export const api = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: false, // ✅ Include cookies (tương đương credentials: 'include' của fetch)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout cho external API
})

// defining a custom error handler for all APIs
const errorHandler = (error: any) => {
    const statusCode = error.response?.status

    // logging only errors that are not 401
    if (statusCode && statusCode !== 401) {
        console.error(error)
    }

    return Promise.reject(error)
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // ✅ Đổi từ 'access_token' sang 'accessToken'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// "api" axios instance
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle CORS errors
        if (!error.response) {
            console.error('Network Error or CORS issue:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your connection or CORS configuration.',
                originalError: error
            });
        }

        const originalRequest = error.config;

        // 401 Unauthorized and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // mark the request as retried
            
            try {
                // Attempt to refresh the token
                const refreshToken = localStorage.getItem('refreshToken'); // ✅ Đổi từ 'refresh_token'
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${apiUrl}/auth/refresh-token`, { 
                    token: refreshToken 
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                // Update the original request's Authorization header
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(errorHandler(error));
    }
);

export default api;