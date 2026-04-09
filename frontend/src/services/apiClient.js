import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Logout user if token is invalid
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
export { API_URL };
