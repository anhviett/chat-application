import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;
export const api = axios.create({
    withCredentials: true,
    baseURL: `${apiUrl}/api/v1`,
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
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// "api" axios instance
api.interceptors.response.use(undefined, (error: any) => {
    return errorHandler(error)
})