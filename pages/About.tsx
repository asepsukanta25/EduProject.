
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 font-bold">Profil belum diatur oleh Admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="md:w-1/3 bg-gray-200">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover aspect-square md:aspect-auto min-h-[400px]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No Photo</div>
            )}
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-yellow-600 font-extrabold tracking-widest text-xs uppercase mb-2 block">
                Pengembang
              </span>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-xl text-gray-500 font-semibold">{profile.role || 'Digital Educator'}</p>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
              "{profile.bio || 'Belum ada bio.'}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium truncate">{profile.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium">Media Sosial</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a 
                href={profile.linkedin || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg shadow-yellow-100"
              >
                LinkedIn
              </a>
              <a 
                href={profile.github || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
