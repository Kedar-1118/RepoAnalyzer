import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060e20]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-indigo-400 font-black text-xl tracking-tighter font-headline">
            Architect
          </span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-label hidden sm:inline">
            Matchmaker
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-label">
            Features
          </a>
          <a href="#repositories" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-label">
            Repositories
          </a>
          <a href="#about" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-label">
            About
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
