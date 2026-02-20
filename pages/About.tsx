
import React, { useEffect, useState } from 'react';
import { DeveloperProfile } from '../types';
import { storageService } from '../services/storageService';

const About: React.FC = () => {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await storageService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <p className="opacity-40 font-bold">Profil belum diatur oleh Admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden flex flex-col md:flex-row border shadow-2xl" style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="md:w-1/3 bg-gray-200">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover aspect-square md:aspect-auto min-h-[400px]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30 italic">No Photo</div>
            )}
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="font-extrabold tracking-widest text-[10px] uppercase mb-2 block" style={{ color: 'var(--secondary)' }}>
                Pengembang
              </span>
              <h1 className="text-4xl font-black mb-2 leading-tight" style={{ color: 'var(--text)' }}>{profile.name}</h1>
              <p className="text-xl font-semibold opacity-50" style={{ color: 'var(--text)' }}>{profile.role || 'Digital Educator'}</p>
            </div>
            
            <p className="text-lg leading-relaxed mb-8 italic opacity-70" style={{ color: 'var(--text)' }}>
              "{profile.bio || 'Selamat datang di portofolio saya.'}"
            </p>

            {/* Informasi Kontak disusun ke bawah (Flex Col) */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center space-x-4 p-4 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary), 0.05)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: 'var(--card)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold break-all">{profile.email || 'email@example.com'}</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(var(--primary), 0.05)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: 'var(--card)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-sm font-bold">{profile.socialLabel || 'Media Sosial'}</span>
              </div>
            </div>

            {/* Tombol Aksi tetap berdampingan (Flex Row) */}
            <div className="flex flex-row gap-4">
              {profile.linkedin && (
                <a 
                  href={profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-center transition-all shadow-xl active:scale-95 text-sm"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)' }}
                >
                  {profile.linkedinLabel || 'LinkedIn'}
                </a>
              )}
              {profile.github && (
                <a 
                  href={profile.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 border-2 px-6 py-4 rounded-2xl font-bold text-center transition-all active:scale-95 shadow-sm text-sm"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}
                >
                  {profile.githubLabel || 'GitHub'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
