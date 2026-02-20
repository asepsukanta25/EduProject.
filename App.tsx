
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';
import { storageService } from './services/storageService';
import { ThemeSettings } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const profile = await storageService.getProfile();
      if (profile?.themeSettings) {
        setTheme(profile.themeSettings);
        const root = document.documentElement;
        const s = profile.themeSettings;
        root.style.setProperty('--primary', s.primaryColor);
        root.style.setProperty('--secondary', s.secondaryColor);
        root.style.setProperty('--accent', s.accentColor);
        root.style.setProperty('--text', s.textColor);
        root.style.setProperty('--bg', s.backgroundColor);
        root.style.setProperty('--card', s.cardColor);
        root.style.setProperty('--radius', s.borderRadius);
      } else {
        // Default values
        const root = document.documentElement;
        root.style.setProperty('--primary', '#facc15');
        root.style.setProperty('--secondary', '#eab308');
        root.style.setProperty('--accent', '#000000');
        root.style.setProperty('--text', '#111827');
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--card', '#ffffff');
        root.style.setProperty('--radius', '1.5rem');
      }
    };
    fetchTheme();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
        <footer className="border-t py-16" style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Footer Logo - Fixed Design */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
                E
              </div>
              <span className="ml-2 text-xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>Project</span>
            </div>
            <div className="w-12 h-1 mx-auto mb-8 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
            <p className="text-sm font-medium opacity-50">
              &copy; {new Date().getFullYear()} E Project. Katalog Proyek Edukasi
            </p>
            <p className="text-sm font-bold mt-2 tracking-wide uppercase opacity-80">
              Asep Sukanta
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
