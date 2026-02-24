
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FolderOpen, User, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/resources', label: 'Sumber Daya', icon: FolderOpen },
    { path: '/about', label: 'Tentang Saya', icon: User },
    { path: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="shadow-sm sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 mr-2">
            <Link to="/" className="flex items-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-md transform -rotate-3 hover:rotate-0 transition-transform" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
                E
              </div>
              <span className="ml-2 text-xl font-black tracking-tighter hidden sm:block" style={{ color: 'var(--text)' }}>
                Project
              </span>
            </Link>
          </div>

          {/* Navigation Links - Scrollable on mobile */}
          <div className="flex-grow overflow-x-auto no-scrollbar flex justify-end h-full items-center">
            <div className="flex space-x-1 sm:space-x-4 h-full items-center px-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`h-10 flex items-center px-3 sm:px-4 rounded-full text-[12px] sm:text-sm whitespace-nowrap transition-all duration-300 group`}
                    style={{ 
                      backgroundColor: active ? 'var(--primary)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text)',
                      opacity: active ? 1 : 0.6
                    }}
                  >
                    <Icon className={`w-4 h-4 sm:mr-2 ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                    <span className={`${active ? 'font-bold' : 'font-medium'} hidden sm:block`}>
                      {link.label}
                    </span>
                    {/* Show label on mobile only if active for a "tab" feel */}
                    <span className={`${active ? 'font-bold ml-2' : 'hidden'} sm:hidden`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
