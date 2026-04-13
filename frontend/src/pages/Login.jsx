import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { API_URL } from '../services/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/8 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-tertiary/8 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Glass Card */}
        <div className="glass-panel rounded-2xl p-10 text-center">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-indigo-400 font-black text-3xl tracking-tighter font-headline">
              Architect
            </span>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-label">
              Matchmaker Engine
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-headline font-extrabold text-on-surface mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
            Sign in with your GitHub account to access your dashboard and start matching.
          </p>

          {/* GitHub Sign In Button */}
          <button
            onClick={handleGitHubLogin}
            className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
            style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/20"></div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">Secure</span>
            <div className="flex-1 h-px bg-outline-variant/20"></div>
          </div>

          {/* Info */}
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We only request read access to your public GitHub data. Your code remains private and secure.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-on-surface-variant hover:text-primary transition-colors font-label flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
