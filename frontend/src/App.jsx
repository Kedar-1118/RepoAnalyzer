import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import Search from './pages/Search';
import Saved from './pages/Saved';
import History from './pages/History';
import Issues from './pages/Issues';
import DeepAnalysis from './pages/DeepAnalysis';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues"
              element={
                <ProtectedRoute>
                  <Issues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deep-analysis"
              element={
                <ProtectedRoute>
                  <DeepAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
