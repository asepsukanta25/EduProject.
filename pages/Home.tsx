
import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';
import { storageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
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

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-yellow-400">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black mb-4">Konfigurasi Diperlukan</h2>
          <p className="text-gray-600 mb-6">
            Aplikasi tidak bisa menampilkan data karena <strong>URL Supabase</strong> belum diisi di file <code className="bg-gray-100 px-2 py-1 rounded">services/supabaseClient.ts</code>.
          </p>
          <p className="text-sm text-gray-400">Silakan ikuti langkah-langkah panduan di chat sebelumnya.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      <section className="theme-gradient py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 animate-bounce-slow">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaW5WrQkMJZtb_G-mIWuX6s77cyjLrVAyLclBI-4_ELGMtduNtr5wXjnh5v5-Sv301QHZwtyclFhtVc0PZM4wpirILYbfWJWg1f1kwzmMjLWwdSwXjU-v_F6VSBIqIhB9EDHumNy1E1QPhQJ5x3QA1oc7QUYYEpXyTGzXXkeJrE6lTUhyphenhyphenFIqtYDiPRZnY/s16000/Screenshot_28.png" className="h-24 md:h-32 mx-auto" alt="Logo" />
          </div>
          <p className="text-xl font-black uppercase mb-10">Katalog Proyek Edukasi</p>
          <input 
            type="text" 
            placeholder="Cari proyek..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-8 py-4 rounded-full shadow-2xl focus:outline-none border-2 border-transparent focus:border-black"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {loading ? (
          <div className="py-20 text-center font-bold">Memuat data cloud...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">Belum ada proyek di database cloud Anda.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
