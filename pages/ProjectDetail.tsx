
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { storageService } from '../services/storageService';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await storageService.getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error("Gagal muat detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--bg)' }}>
        <h2 className="text-2xl font-black mb-4" style={{ color: 'var(--text)' }}>Proyek Tidak Ditemukan</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>Kembali ke Beranda</button>
      </div>
    );
  }

  // Parse gallery URLs
  const galleryImages = project.detailGallery 
    ? project.detailGallery.split(',').map(url => url.trim()).filter(url => url !== '') 
    : [];

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero Header */}
      <div className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 w-full">
            <button 
              onClick={() => navigate('/')}
              className="mb-6 md:mb-8 flex items-center space-x-2 font-bold hover:translate-x-[-4px] transition-transform text-sm md:text-base"
              style={{ color: 'var(--primary)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}>
              {project.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight tracking-tight" style={{ color: 'var(--primary)' }}>{project.title}</h1>
            <p className="text-base md:text-lg leading-relaxed font-medium opacity-70" style={{ color: 'var(--primary)' }}>
              {project.description}
            </p>
          </div>
          <div className="md:w-1/2 w-full">
             <div className="relative group">
               <div className="absolute inset-0 rounded-3xl blur-2xl transform scale-90 group-hover:scale-100 transition-transform" style={{ backgroundColor: 'rgba(var(--primary), 0.2)' }}></div>
               <img src={project.imageUrl} alt={project.title} className="w-full rounded-3xl shadow-2xl border-4 relative z-10 object-cover aspect-video md:aspect-auto" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" style={{ backgroundColor: 'rgba(var(--primary), 0.1)' }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-20">
        <div className="shadow-2xl p-8 md:p-16 border" style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', borderColor: 'rgba(0,0,0,0.05)' }}>
          
          {/* Main Content Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-10 border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}>📄</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Deskripsi Proyek</h2>
                <div className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="leading-[1.8] whitespace-pre-wrap font-medium text-base md:text-lg tracking-wide opacity-80" style={{ color: 'var(--text)' }}>
                {project.detailContent || (
                  <div className="p-8 rounded-2xl border-2 border-dashed text-center italic opacity-40" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.1)' }}>
                    Belum ada deskripsi mendalam untuk proyek ini. Silakan tambahkan melalui panel Admin.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {galleryImages.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center space-x-3 mb-10 border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}>📸</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Galeri Visual</h2>
                  <div className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: 'var(--primary)' }}></div>
                </div>
              </div>
              
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="break-inside-avoid overflow-hidden shadow-xl group border" style={{ borderRadius: 'var(--radius)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 cursor-zoom-in block" 
                      onClick={() => window.open(img, '_blank')}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Embed */}
          {project.detailVideo && (
            <div className="mb-20">
              <div className="flex items-center space-x-3 mb-10 border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}>🎥</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Presentasi Video</h2>
                  <div className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: 'var(--primary)' }}></div>
                </div>
              </div>

              <div className="aspect-video w-full overflow-hidden shadow-2xl bg-black border-[6px] md:border-[12px] ring-1 ring-gray-100" style={{ borderRadius: 'var(--radius)', borderColor: 'var(--card)' }}>
                <iframe 
                  className="w-full h-full"
                  src={project.detailVideo}
                  title="Project Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-6 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] italic opacity-40">Multimedia Streaming Mode</p>
            </div>
          )}

          {/* Final Call to Action */}
          <div className="rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">Siap untuk Menjelajahi?</h3>
              <p className="mb-10 max-w-md mx-auto font-medium leading-relaxed opacity-60">
                Klik tombol di bawah ini untuk mengakses aplikasi atau platform proyek secara langsung.
              </p>
              <a 
                href={project.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-4 px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl hover:bg-white transition-all shadow-2xl group"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}
              >
                <span>BUKA APLIKASI</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--primary), 0.1)' }}></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
