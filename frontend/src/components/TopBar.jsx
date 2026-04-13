import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const TopBar = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 w-full z-30 bg-[#060e20]/80 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-outline-variant/15">
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden mr-4 text-slate-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Search Bar */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search repositories or developers..."
            className="w-full bg-transparent border-b border-outline-variant/20 py-2 pl-10 pr-4 text-sm font-label focus:outline-none focus:border-primary transition-all text-on-surface placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-opacity relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#060e20]"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-opacity">
          <span className="material-symbols-outlined">history</span>
        </button>

        {/* Separator */}
        <div className="h-8 w-[1px] bg-outline-variant/20 hidden sm:block"></div>

        {/* User Avatar */}
        {user?.avatar_url && (
          <button
            onClick={() => navigate('/profile')}
            className="flex-shrink-0"
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-8 h-8 rounded-full ring-2 ring-primary/20 object-cover hover:ring-primary/40 transition-all"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
