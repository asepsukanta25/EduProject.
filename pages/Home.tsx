
import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project, LayoutSettings } from '../types';
import { storageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const profile = await storageService.getProfile();
      if (profile?.appLogoUrl) {
        setLogoUrl(profile.appLogoUrl);
      }
      if (profile?.layoutSettings) {
        setLayoutSettings(profile.layoutSettings);
      }
    };
    fetchProfileData();

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

  const getLayoutStyles = () => {
    if (!layoutSettings) return { gridClass: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", gap: "gap-8", isMasonry: false };

    const { preset, columnsDesktop, columnsTablet, columnsMobile, gap, isAutoFit } = layoutSettings;
    
    const gapClass = `gap-[${gap * 4}px]`; // Tailwind gap is usually 4px per unit, but I'll use arbitrary values for precision
    const gapStyle = { gap: `${gap * 4}px` };

    if (preset === 'masonry') {
      return { 
        containerClass: `columns-${columnsMobile} md:columns-${columnsTablet} lg:columns-${columnsDesktop}`, 
        gapStyle,
        isMasonry: true 
      };
    }

    if (isAutoFit) {
      return { 
        gridStyle: { 
          display: 'grid', 
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`,
          ...gapStyle 
        }, 
        isMasonry: false 
      };
    }

    return { 
      gridClass: `grid-cols-${columnsMobile} md:grid-cols-${columnsTablet} lg:grid-cols-${columnsDesktop}`, 
      gridStyle: gapStyle,
      isMasonry: false 
    };
  };

  const layout = getLayoutStyles();

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
          <div className="mb-8 animate-bounce-slow flex flex-col items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                className="h-24 md:h-32 mx-auto object-contain drop-shadow-2xl" 
                alt="Logo Aplikasi" 
              />
            ) : (
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-black rounded-[2rem] flex items-center justify-center text-yellow-400 text-5xl md:text-6xl font-black shadow-2xl transform -rotate-6">
                  E
                </div>
                <span className="ml-4 text-4xl md:text-6xl font-black text-black tracking-tighter">Project</span>
              </div>
            )}
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
          <div 
            className={`${layout.isMasonry ? layout.containerClass : `grid ${layout.gridClass || ''}`} transition-all duration-500`}
            style={layout.gridStyle}
          >
            {filteredProjects.map(p => (
              <div key={p.id} className={layout.isMasonry ? "mb-6 break-inside-avoid" : ""}>
                <ProjectCard project={p} />
              </div>
            ))}
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
