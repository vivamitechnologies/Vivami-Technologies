import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from './AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Technologies', href: '/technologies' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-sm font-bold tracking-tight transition-all hover:text-brand-600 ${location.pathname === link.href ? 'text-brand-600' : 'text-slate-600'}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-slate-200 mx-2" />

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === '/admin' ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'}`} onClick={() => window.scrollTo(0, 0)}>
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className={`flex items-center gap-2 px-2 py-2 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'}`} onClick={() => window.scrollTo(0, 0)}>
                <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="bg-brand-600 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-100">
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-slate-900 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full left-4 right-4 bg-white rounded-[32px] p-8 lg:hidden flex flex-col gap-4 shadow-2xl border border-slate-100"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-lg font-black tracking-tight ${location.pathname === link.href ? 'text-brand-600' : 'text-slate-900'}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-slate-100 my-2" />
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-3 py-4 text-slate-900 font-bold border-2 border-slate-100 rounded-2xl px-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  User Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-3 py-4 text-slate-900 font-bold border-2 border-slate-100 rounded-2xl px-6"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5 text-brand-600" />
                    Admin Control Panel
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 py-4 text-red-500 font-bold px-6"
                >
                  <LogOut className="w-5 h-5" />
                  Logout Session
                </button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <Link to="/login" className="bg-brand-600 text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-brand-100" onClick={() => setMobileMenuOpen(false)}>
                  Authenticate Session
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
