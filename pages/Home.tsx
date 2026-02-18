
import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';
import { storageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const profile = await storageService.getProfile();
      if (profile?.appLogoUrl) {
        setLogoUrl(profile.appLogoUrl);
      }
    };
    fetchLogo();

    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await storageService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Gagal muat data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const title = p.title || '';
    const cat = p.category || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           cat.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const defaultHeroLogo = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaW5WrQkMJZtb_G-mIWuX6s77cyjLrVAyLclBI-4_ELGMtduNtr5wXjnh5v5-Sv301QHZwtyclFhtVc0PZM4wpirILYbfWJWg1f1kwzmMjLWwdSwXjU-v_F6VSBIqIhB9EDHumNy1E1QPhQJ5x3QA1oc7QUYYEpXyTGzXXkeJrE6lTUhyphenhyphenFIqtYDiPRZnY/s16000/Screenshot_28.png";

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
            <img 
              src={logoUrl || defaultHeroLogo} 
              className="h-24 md:h-32 mx-auto object-contain drop-shadow-2xl" 
              alt="Logo Aplikasi" 
            />
          </div>
          <p className="text-xl font-black uppercase mb-10 tracking-widest text-black/80">Katalog Proyek Edukasi</p>
          <div className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder="Cari berdasarkan judul atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-8 py-5 rounded-full shadow-2xl focus:outline-none border-2 border-transparent focus:border-black transition-all text-lg font-medium"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Background blobs for aesthetics */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {loading ? (
          <div className="py-32 text-center">
             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
             <p className="font-black text-gray-400 uppercase tracking-widest">Sinkronisasi Cloud...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-32 bg-gray-50 rounded-[3rem] text-center border-4 border-dashed border-gray-100">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Proyek Tidak Ditemukan</h3>
                <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                  Coba gunakan kata kunci lain atau pastikan proyek sudah ditambahkan di Dashboard Admin.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
