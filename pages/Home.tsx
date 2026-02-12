
import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';
import { storageService } from '../services/storageService';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await storageService.getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* Hero Section */}
      <section className="theme-gradient py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
          <div className="mb-8 animate-bounce-slow">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaW5WrQkMJZtb_G-mIWuX6s77cyjLrVAyLclBI-4_ELGMtduNtr5wXjnh5v5-Sv301QHZwtyclFhtVc0PZM4wpirILYbfWJWg1f1kwzmMjLWwdSwXjU-v_F6VSBIqIhB9EDHumNy1E1QPhQJ5x3QA1oc7QUYYEpXyTGzXXkeJrE6lTUhyphenhyphenFIqtYDiPRZnY/s16000/Screenshot_28.png" 
              alt="EduProject Logo" 
              className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl rounded-2xl bg-black/5 p-2 backdrop-blur-sm"
            />
          </div>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-10 leading-relaxed font-bold uppercase tracking-tight">
            Portofolio proyek edukasi digital dari EduProject.
          </p>
          <div className="w-full max-w-lg mx-auto relative group">
            <input 
              type="text" 
              placeholder="Cari proyek atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-8 py-5 rounded-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-2xl text-lg border-2 border-transparent focus:border-black"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-gray-500 uppercase tracking-widest text-xs">Menghubungkan ke Cloud...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[40px] shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">Tidak ada proyek ditemukan</h3>
              </div>
            )}
          </div>
        )}
      </section>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
