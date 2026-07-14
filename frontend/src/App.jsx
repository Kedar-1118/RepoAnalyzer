import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';

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
import AnalysisResult from './pages/AnalysisResult';
import BulkAnalysis from './pages/BulkAnalysis';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CandidateSearch from './pages/recruiter/CandidateSearch';
import CandidateEvaluation from './pages/recruiter/CandidateDetail';
import Shortlist from './pages/recruiter/Shortlist';
import Reports from './pages/recruiter/Reports';

// Layout Components
import AppLayout from './components/AppLayout';
import Toast from './components/Toast';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
};

const RoleRoute = ({ requirement, children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== requirement) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-surface text-on-surface">
          <Routes>
            {/* Public Routes — no sidebar */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes — sidebar + topbar layout */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
            <Route path="/deep-analysis" element={<ProtectedRoute><DeepAnalysis /></ProtectedRoute>} />
            <Route path="/analysis-result" element={<ProtectedRoute><AnalysisResult /></ProtectedRoute>} />
            <Route path="/bulk-analysis" element={<ProtectedRoute><BulkAnalysis /></ProtectedRoute>} />
            {/* <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} /> */}
            <Route path="/candidates/:username" element={<ProtectedRoute><CandidateDetail /></ProtectedRoute>} />

            {/* Recruiter Routes */}
            <Route path="/recruiter/dashboard" element={<RoleRoute requirement="recruiter"><RecruiterDashboard /></RoleRoute>} />
            <Route path="/recruiter/search" element={<RoleRoute requirement="recruiter"><CandidateSearch /></RoleRoute>} />
            <Route path="/recruiter/profile/:username" element={<RoleRoute requirement="recruiter"><CandidateEvaluation /></RoleRoute>} />
            <Route path="/recruiter/shortlist" element={<RoleRoute requirement="recruiter"><Shortlist /></RoleRoute>} />
            <Route path="/recruiter/reports/:username?" element={<RoleRoute requirement="recruiter"><Reports /></RoleRoute>} />

            {/* Default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
