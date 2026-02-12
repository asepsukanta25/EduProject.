
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-black font-bold border-b-2 border-yellow-400' : 'text-gray-600 hover:text-black';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-yellow-400 font-bold shadow-sm">E</div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">EduProject</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link to="/" className={`px-1 py-2 text-sm transition-colors ${isActive('/')}`}>
              Perpustakaan
            </Link>
            <Link to="/about" className={`px-1 py-2 text-sm transition-colors ${isActive('/about')}`}>
              Tentang Saya
            </Link>
            <Link to="/admin" className={`px-1 py-2 text-sm transition-colors ${isActive('/admin')}`}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
