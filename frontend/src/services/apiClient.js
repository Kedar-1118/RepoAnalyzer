import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance — cookies are sent automatically via withCredentials
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,  // send httpOnly cookies with every request
});

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If 401 or 403 (expired / invalid cookie) — clear local state & redirect
        if (error.response?.status === 401 || error.response?.status === 403) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
export { API_URL };
