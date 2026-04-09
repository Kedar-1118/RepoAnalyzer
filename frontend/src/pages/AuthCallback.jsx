import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/api';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            const userData = searchParams.get('user');
            const errorMsg = searchParams.get('error');

            if (errorMsg) {
                setError(errorMsg);
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (token) {
                try {
                    if (userData) {
                        // User data provided in URL
                        const user = JSON.parse(decodeURIComponent(userData));
                        setAuth(user, token);
                        navigate('/dashboard');
                    } else {
                        // Only token provided, fetch user data from backend
                        // Temporarily set token so apiClient can use it
                        setAuth(null, token);

                        const data = await authService.verifyToken();
                        setAuth(data.user, token);
                        navigate('/dashboard');
                    }
                } catch (err) {
                    console.error('Auth error:', err);
                    setError('Failed to complete authentication');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } else {
                setError('Missing authentication token');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleAuth();
    }, [searchParams, navigate, setAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
            <div className="text-center space-y-4">
                {error ? (
                    <>
                        <div className="text-red-500 text-xl font-semibold">
                            Authentication Error
                        </div>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            {error}
                        </p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Redirecting to login...
                        </p>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-light-accent dark:text-dark-primary mx-auto" />
                        <p className="text-light-text dark:text-dark-text">
                            Completing authentication...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
