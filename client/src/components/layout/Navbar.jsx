import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Menu, X, Sun, Moon, MapPin,
  LayoutDashboard, LogOut, User,
  ChevronDown, Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { getInitials, avatarColor } from '../../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { unreadCount }  = useApp();
  const navigate         = useNavigate();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-700/60'
          : 'bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="container-app flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="gradient-text">FindIt</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-link px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'nav-link-active bg-primary-50 dark:bg-primary-900/20' : ''}`
            }
          >
            Browse Items
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'nav-link-active bg-primary-50 dark:bg-primary-900/20' : ''}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/report/lost"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'nav-link-active' : ''}`
                }
              >
                Report Lost
              </NavLink>
              <NavLink
                to="/report/found"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'nav-link-active' : ''}`
                }
              >
                Report Found
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Search icon */}
          <button
            onClick={() => navigate('/search')}
            className="btn-ghost p-2 rounded-xl hidden sm:flex"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-xl"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="btn-ghost p-2 rounded-xl relative">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${avatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold`}>
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-secondary dark:text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 card shadow-card-hover py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-secondary dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      {[
                        { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
                        { to: '/profile',      icon: User,            label: 'Profile' },
                        { to: '/bookmarks',    icon: Search,          label: 'Bookmarks' },
                        ...(user.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
                      ].map(({ to, icon: Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                        >
                          <Icon size={15} className="text-slate-400" />
                          {label}
                        </Link>
                      ))}

                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost px-4 py-2 text-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary px-4 py-2 text-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-dark overflow-hidden"
          >
            <div className="container-app py-4 flex flex-col gap-1">
              {[
                { to: '/search',       label: 'Browse Items' },
                ...(user
                  ? [
                      { to: '/dashboard',   label: 'Dashboard' },
                      { to: '/report/lost', label: 'Report Lost' },
                      { to: '/report/found',label: 'Report Found' },
                      { to: '/notifications',label: 'Notifications' },
                      { to: '/profile',     label: 'Profile' },
                    ]
                  : [
                      { to: '/login',   label: 'Sign In' },
                      { to: '/signup',  label: 'Get Started' },
                    ]),
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {user && (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="mt-2 text-left px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
