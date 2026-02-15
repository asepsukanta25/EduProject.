
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black mb-4">Proyek Tidak Ditemukan</h2>
        <button onClick={() => navigate('/')} className="bg-black text-yellow-400 px-8 py-3 rounded-xl font-bold">Kembali ke Beranda</button>
      </div>
    );
  }

  // Parse gallery URLs
  const galleryImages = project.detailGallery 
    ? project.detailGallery.split(',').map(url => url.trim()).filter(url => url !== '') 
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="bg-black text-white py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <button 
              onClick={() => navigate('/')}
              className="mb-8 text-yellow-400 flex items-center space-x-2 font-bold hover:translate-x-[-4px] transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{project.title}</h1>
            <p className="text-gray-400 text-lg">{project.description}</p>
          </div>
          <div className="md:w-1/2">
             <img src={project.imageUrl} alt={project.title} className="w-full rounded-3xl shadow-2xl border-4 border-white/10" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100">
          
          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 text-sm">📄</span>
              Deskripsi Proyek
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
              {project.detailContent || "Belum ada deskripsi mendalam untuk proyek ini."}
            </div>
          </div>

          {/* Gallery Grid */}
          {galleryImages.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 text-sm">📸</span>
                Galeri Visual
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm group">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in" 
                      onClick={() => window.open(img, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Embed */}
          {project.detailVideo && (
            <div className="mb-16">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 text-sm">🎥</span>
                Presentasi Video
              </h2>
              <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl bg-black border-8 border-gray-50">
                <iframe 
                  className="w-full h-full"
                  src={project.detailVideo}
                  title="Project Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest italic">Video diputar dari sumber eksternal</p>
            </div>
          )}

          {/* Final Call to Action */}
          <div className="bg-gray-900 rounded-[2rem] p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl font-black mb-4">Siap untuk Menjelajahi?</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Klik tombol di bawah ini untuk mengakses aplikasi atau platform proyek secara langsung.</p>
            <a 
              href={project.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-yellow-400/20"
            >
              <span>BUKA APLIKASI</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;