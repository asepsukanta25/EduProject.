
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-yellow-400 text-xs font-black shadow-lg">E</div>
              <span className="text-xl font-black text-gray-900 tracking-tighter">EduProject</span>
            </div>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-400 text-sm font-medium">
              &copy; {new Date().getFullYear()} EduProject. Dibuat dengan dedikasi untuk masa depan pendidikan Indonesia.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
