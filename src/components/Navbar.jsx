import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, Mail, User, Shield } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Double-check admin status
  const userIsAdmin = isAdmin || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="neu-card max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="neu-circle w-10 h-10">
            <span className="text-primary font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-textPrimary">ServeX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive(link.path)
                  ? 'neu-pressed text-primary font-medium'
                  : 'hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            userIsAdmin ? (
              <Link
                to="/admin"
                className="neu-button-primary px-6 py-2 rounded-xl ml-2 flex items-center gap-2"
                style={{ background: 'linear-gradient(145deg, #5b8bf7, #7c3aed)' }}
              >
                <Shield size={18} />
                Admin
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="neu-button-primary px-6 py-2 rounded-xl ml-2 flex items-center gap-2"
              >
                <User size={18} />
                Dashboard
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="neu-button-primary px-6 py-2 rounded-xl ml-2"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden neu-circle w-10 h-10"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden neu-card mt-2 mx-auto max-w-7xl p-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl flex items-center gap-3 ${
                  isActive(link.path)
                    ? 'neu-pressed text-primary font-medium'
                    : 'hover:bg-surface'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            
            {user ? (
              userIsAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="neu-button-primary px-4 py-3 rounded-xl flex items-center gap-3 mt-2"
                >
                  <Shield size={18} />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="neu-button-primary px-4 py-3 rounded-xl flex items-center gap-3 mt-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
              )
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="neu-button-primary px-4 py-3 rounded-xl mt-2 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}