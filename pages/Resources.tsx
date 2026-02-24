import React, { useEffect, useState } from 'react';
import { DownloadItem } from '../types';
import { storageService } from '../services/storageService';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const data = await storageService.getResources();
      setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const getIcon = (type: 'excel' | 'json') => {
    if (type === 'excel') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#217346" />
          <path d="M14 2V8H20L14 2Z" fill="#185C37" />
          <path d="M8 12L12 16M12 12L8 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#F7DF1E" />
        <path d="M14 2V8H20L14 2Z" fill="#D4B814" />
        <path d="M9 13C9 13 10 12 11 12C12 12 13 13 13 13" stroke="black" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 17C9 17 10 18 11 18C12 18 13 17 13 17" stroke="black" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--text)' }}>Sumber Daya Digital</h1>
          <p className="opacity-60 max-w-2xl mx-auto font-medium">
            Kumpulan berkas pendukung proyek edukasi dalam format Excel dan JSON yang dapat Anda unduh secara gratis.
          </p>
          <div className="h-1 w-20 mx-auto mt-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-[2rem] opacity-30" style={{ borderColor: 'var(--text)' }}>
            <p className="font-bold italic">Belum ada sumber daya yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resources.map((item) => (
              <div 
                key={item.id} 
                className="p-8 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
                style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p className="opacity-60 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{item.description}</p>
                </div>
                
                <a 
                  href={item.fileUrl} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto flex items-center justify-center space-x-3 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg group"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    {getIcon(item.fileType)}
                  </div>
                  <span className="uppercase tracking-widest text-sm">Unduh {item.fileType}</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
