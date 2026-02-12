
import React, { useState, useEffect } from 'react';
import { Project, DeveloperProfile } from '../types';
import { storageService } from '../services/storageService';

const ADMIN_CODE = 'Indme&781l';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    setSyncing(true);
    const pData = await storageService.getProjects();
    const profData = await storageService.getProfile();
    setProjects(pData);
    setProfile(profData);
    setSyncing(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Kode akses salah.');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSyncing(true);
    await storageService.saveProject(editingProject);
    await refreshData();
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Hapus proyek ini dari cloud?')) {
      setSyncing(true);
      await storageService.deleteProject(id);
      await refreshData();
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSyncing(true);
    await storageService.saveProfile(profile);
    setSyncing(false);
    alert('Profil tersinkronisasi ke Cloud!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-black mx-auto mb-6 shadow-xl rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-2">Supabase Sync Mode</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Masukkan Kode Akses" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-yellow-400 outline-none transition-all text-center text-xl font-bold tracking-widest"
            />
            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="w-full bg-black text-yellow-400 font-black text-lg py-5 rounded-2xl shadow-xl">MASUK PANEL</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {syncing && (
        <div className="fixed top-20 right-8 z-50 bg-black text-yellow-400 px-4 py-2 rounded-full text-xs font-black animate-pulse flex items-center space-x-2 shadow-2xl">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <span>SINKRONISASI CLOUD...</span>
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900 p-8 rounded-[2rem] text-white">
          <div>
            <h1 className="text-3xl font-black text-yellow-400">Dashboard Admin</h1>
            <p className="text-gray-400">Status: Terhubung ke Supabase</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => { setEditingProject({ id: '', title: '', description: '', imageUrl: '', externalUrl: '', category: 'Edukasi' }); setShowProjectModal(true); }} className="bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black">Tambah Proyek</button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-white/10 text-white px-6 py-4 rounded-2xl font-bold">Keluar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Katalog Proyek</h2>
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                  <tr><th className="px-8 py-5">Info Proyek</th><th className="px-8 py-5 text-right">Kelola</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-yellow-50/30 transition-colors">
                      <td className="px-8 py-6 flex items-center space-x-5">
                        <img src={project.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt="" />
                        <div><div className="font-bold text-gray-900">{project.title}</div><div className="text-xs text-gray-400">{project.category}</div></div>
                      </td>
                      <td className="px-8 py-6 text-right space-x-3">
                        <button onClick={() => { setEditingProject(project); setShowProjectModal(true); }} className="p-3 bg-gray-50 rounded-xl">Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-red-50 text-red-500 rounded-xl">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Profil Admin</h2>
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 space-y-5">
              {profile && (
                <>
                  <input name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold" placeholder="Nama" />
                  <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={4} className="w-full px-5 py-4 rounded-xl bg-gray-50" placeholder="Bio" />
                  <button onClick={handleSaveProfile} className="w-full bg-black text-yellow-400 font-black py-4 rounded-xl">Simpan ke Cloud</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProjectModal && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-8 bg-yellow-400 flex justify-between items-center">
              <h3 className="text-2xl font-black text-black">{editingProject.id ? 'Edit Cloud Project' : 'Tambah Baru'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="bg-black text-white p-2 rounded-xl">X</button>
            </div>
            <form onSubmit={handleSaveProject} className="p-8 space-y-5">
              <input required value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 font-bold" placeholder="Judul" />
              <input required value={editingProject.imageUrl} onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50" placeholder="URL Gambar" />
              <input required value={editingProject.externalUrl} onChange={(e) => setEditingProject({...editingProject, externalUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50" placeholder="Link Aplikasi" />
              <textarea required rows={3} value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 resize-none" placeholder="Deskripsi" />
              <button type="submit" className="w-full bg-black text-yellow-400 font-black py-5 rounded-2xl">SIMPAN KE CLOUD</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
