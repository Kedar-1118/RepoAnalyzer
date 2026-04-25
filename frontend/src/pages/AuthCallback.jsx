import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/api';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            const userData = searchParams.get('user');
            const errorMsg = searchParams.get('error');

            if (errorMsg) {
                setError(errorMsg);
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                if (userData) {
                    // User data provided in URL — session cookie was already set by the backend redirect
                    const user = JSON.parse(decodeURIComponent(userData));
                    setAuth(user);
                    navigate(user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard');
                } else {
                    // No user data in URL — verify the cookie-based session with the backend
                    const data = await authService.verifyToken();
                    setAuth(data.user);
                    navigate(data.user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard');
                }
            } catch (err) {
                console.error('Auth error:', err);
                setError('Failed to complete authentication');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleAuth();
    }, [searchParams, navigate, setAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center space-y-4">
                {error ? (
                    <>
                        <div className="text-red-500 text-xl font-semibold">
                            Authentication Error
                        </div>
                        <p className="text-on-surface-variant">
                            {error}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                            Redirecting to login...
                        </p>
                    </>
                ) : (
                    <>
                        <div className="loader mx-auto"></div>
                        <p className="text-on-surface">
                            Completing authentication...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
