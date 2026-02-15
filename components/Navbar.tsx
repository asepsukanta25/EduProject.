
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-black font-bold border-b-2 border-yellow-400' 
      : 'text-gray-500 hover:text-black border-b-2 border-transparent';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-yellow-400 font-black shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
                E
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter hidden sm:block">
                EduProject
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-3 sm:space-x-8 h-full items-center">
            <Link 
              to="/" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/')}`}
            >
              Beranda
            </Link>
            <Link 
              to="/about" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/about')}`}
            >
              Tentang Saya
            </Link>
            <Link 
              to="/admin" 
              className={`h-full flex items-center px-1 text-[13px] sm:text-sm transition-all duration-300 ${isActive('/admin')}`}
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