import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useLogout } from '../hooks/useApi';

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/deep-analysis', icon: 'analytics', label: 'Repo Analyzer' },
  { path: '/recommendations', icon: 'handshake', label: 'Matches' },
  { path: '/candidates', icon: 'group', label: 'Candidates' },
  { path: '/saved', icon: 'bookmark', label: 'Bookmarks' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

const recruiterNavItems = [
  { path: '/recruiter/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/recruiter/search', icon: 'search', label: 'Search' },
  { path: '/recruiter/shortlist', icon: 'bookmarks', label: 'Shortlist' },
  { path: '/recruiter/reports', icon: 'description', label: 'Reports' },
];

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <aside className="flex flex-col h-screen w-64 bg-[#060e20] z-50 border-r border-slate-800/30">
      {/* Logo */}
      <div className="px-6 py-8">
        <Link to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'} className="block">
          <span className="text-indigo-400 font-black text-2xl tracking-tighter font-headline">
            Architect
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4">
        {(user?.role === 'recruiter' ? recruiterNavItems : navItems).map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-indigo-500/10 text-[#9fa7ff] rounded-full border-l-4 border-[#c180ff]'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-full'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label text-sm tracking-wide uppercase font-bold">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* New Analysis CTA */}
      {user?.role !== 'recruiter' && (
      <div className="px-4 py-4">
        <button
          onClick={() => handleNavClick('/deep-analysis')}
          className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)' }}
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span className="text-white">New Analysis</span>
        </button>
      </div>
      )}

      {/* User Profile + Footer */}
      <div className="mt-auto border-t border-outline-variant/10 px-4 py-6">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  {user.login?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface tracking-tight uppercase">
                {user.login}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                {user.role === 'recruiter' ? 'Recruiter' : 'Developer'}
              </p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-indigo-300 transition-all rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-sm font-label">Settings</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 transition-all rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-sm font-label">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-50">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden animate-slide-in">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
