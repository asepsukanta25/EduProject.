
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'font-bold border-b-2' 
      : 'opacity-50 hover:opacity-100 border-b-2 border-transparent';
  };

  const activeStyle = (path: string) => {
    return location.pathname === path ? { borderColor: 'var(--primary)', color: 'var(--text)' } : { color: 'var(--text)' };
  };

  return (
    <nav className="shadow-sm sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section - Fixed design with E box */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-md transform -rotate-3 hover:rotate-0 transition-transform" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
                E
              </div>
              <span className="ml-2 text-xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
                Project
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-3 sm:space-x-8 h-full items-center">
            <Link 
              to="/" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/')}`}
              style={activeStyle('/')}
            >
              Beranda
            </Link>
            <Link 
              to="/resources" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/resources')}`}
              style={activeStyle('/resources')}
            >
              Sumber Daya
            </Link>
            <Link 
              to="/about" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/about')}`}
              style={activeStyle('/about')}
            >
              Tentang Saya
            </Link>
            <Link 
              to="/admin" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/admin')}`}
              style={activeStyle('/admin')}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
