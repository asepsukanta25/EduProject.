
import { Project, DeveloperProfile } from '../types';
import { storageService } from '../services/storageService';
import React, { useState, useEffect } from 'react';

const ADMIN_CODE = 'Indme&781l';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  
  const [toast, setToast] = useState<{ show: boolean; message: string; isError?: boolean }>({ show: false, message: '', isError: false });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const showNotification = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: '', isError: false });
    }, 4000);
  };

  const refreshData = async (manual = false) => {
    setSyncing(true);
    try {
      const pData = await storageService.getProjects();
      const profData = await storageService.getProfile();
      setProjects(pData);
      setProfile(profData);
      if (manual) {
        showNotification('Data terbaru berhasil ditarik dari Cloud!');
      }
    } catch (err: any) {
      showNotification('Gagal menarik data: ' + (err.message || 'Cek koneksi'), true);
    } finally {
      setSyncing(false);
    }
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
    try {
      await storageService.saveProject(editingProject);
      await refreshData();
      setShowProjectModal(false);
      setEditingProject(null);
      showNotification('Proyek berhasil disinkronkan ke Cloud!');
    } catch (err: any) {
      console.error(err);
      showNotification('GAGAL SIMPAN: ' + (err.message || 'Cek struktur tabel Supabase'), true);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Hapus proyek ini dari cloud?')) {
      setSyncing(true);
      try {
        await storageService.deleteProject(id);
        await refreshData();
        showNotification('Proyek berhasil dihapus!');
      } catch (err: any) {
        showNotification('Gagal menghapus: ' + err.message, true);
      } finally {
        setSyncing(false);
      }
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
    try {
      await storageService.saveProfile(profile);
      showNotification('Profil Admin berhasil diperbarui!');
    } catch (err: any) {
      showNotification('Gagal simpan profil: ' + err.message, true);
    } finally {
      setSyncing(false);
    }
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
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${toast.isError ? 'bg-red-600 text-white border-red-800' : 'bg-black text-yellow-400 border-yellow-400'} px-8 py-4 rounded-2xl shadow-2xl border-2 flex items-center space-x-3`}>
            {toast.isError ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="font-black tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}

      {syncing && (
        <div className="fixed top-20 right-8 z-50 bg-black text-yellow-400 px-4 py-2 rounded-full text-xs font-black animate-pulse flex items-center space-x-2 shadow-2xl border border-yellow-400/30">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <span>SINKRONISASI CLOUD...</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900 p-8 rounded-[2rem] text-white shadow-2xl border-b-4 border-yellow-400">
          <div>
            <h1 className="text-3xl font-black text-yellow-400">Dashboard Admin</h1>
            <p className="text-gray-400">Status: Terhubung ke Supabase</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => refreshData(true)} 
              disabled={syncing}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Tarik Data Cloud</span>
            </button>
            <button 
              onClick={() => { setEditingProject({ id: '', title: '', description: '', imageUrl: '', externalUrl: '', category: 'Edukasi', order: (projects.length + 1) }); setShowProjectModal(true); }} 
              className="bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black shadow-lg shadow-yellow-400/20 hover:-translate-y-1 transition-all"
            >
              Tambah Proyek
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-white/5 hover:bg-white/10 text-white/60 px-6 py-4 rounded-2xl font-bold transition-all">Keluar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
              <span>Katalog Proyek</span>
              {projects.length > 0 && <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full">{projects.length} Total</span>}
            </h2>
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                  <tr>
                    <th className="px-8 py-5 w-16">Urut</th>
                    <th className="px-8 py-5">Info Proyek</th>
                    <th className="px-8 py-5 text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.length === 0 && !syncing ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center">
                        <p className="text-gray-400 font-bold italic">Cloud Database kosong. Silakan tambah proyek atau tarik data.</p>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.id} className="hover:bg-yellow-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="bg-gray-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-lg">
                            {project.order}
                          </span>
                        </td>
                        <td className="px-8 py-6 flex items-center space-x-5">
                          <img src={project.imageUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-2xl object-cover shadow-md transition-transform group-hover:scale-110" alt="" />
                          <div>
                            <div className="font-bold text-gray-900">{project.title}</div>
                            <div className="text-xs text-gray-400">{project.category || 'Tanpa Label'}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-3">
                          <button onClick={() => { setEditingProject(project); setShowProjectModal(true); }} className="p-3 bg-gray-50 hover:bg-yellow-100 rounded-xl font-bold text-sm transition-colors">Edit</button>
                          <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl font-bold text-sm transition-all">Hapus</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Profil Admin</h2>
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 space-y-5">
              {profile && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nama Lengkap</label>
                    <input name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Nama" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Peran / Role</label>
                    <input name="role" value={profile.role} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Contoh: Digital Educator" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">URL Foto Profil</label>
                    <input name="photoUrl" value={profile.photoUrl} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 text-xs border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Email</label>
                    <input name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">LinkedIn URL</label>
                    <input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 text-xs border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="LinkedIn" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">GitHub URL</label>
                    <input name="github" value={profile.github} onChange={handleProfileChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 text-xs border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="GitHub" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Bio Singkat</label>
                    <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all text-sm" placeholder="Bio" />
                  </div>
                  <button onClick={handleSaveProfile} className="w-full bg-black text-yellow-400 font-black py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:text-black transition-all">Simpan ke Cloud</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProjectModal && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-yellow-400 flex justify-between items-center">
              <h3 className="text-2xl font-black text-black">{editingProject.id ? 'Edit Cloud Project' : 'Tambah Baru'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="bg-black text-white p-2 rounded-xl hover:rotate-90 transition-transform font-black w-10 h-10">X</button>
            </div>
            <form onSubmit={handleSaveProject} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Judul Proyek</label>
                  <input required value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Judul" />
                </div>
                
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Urutan (Angka)</label>
                  <input type="number" required value={editingProject.order} onChange={(e) => setEditingProject({...editingProject, order: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-900 text-yellow-400 font-black focus:border-yellow-300 outline-none transition-all" />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Kategori</label>
                  <input value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 font-bold text-yellow-600 focus:border-yellow-400 outline-none transition-all" placeholder="Kategori" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">URL Gambar Preview</label>
                <input required value={editingProject.imageUrl} onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all" placeholder="URL Gambar" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Link Eksternal Aplikasi</label>
                <input required value={editingProject.externalUrl} onChange={(e) => setEditingProject({...editingProject, externalUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all" placeholder="Link Aplikasi" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Deskripsi Singkat</label>
                <textarea required rows={3} value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 bg-gray-50 resize-none focus:border-yellow-400 outline-none transition-all" placeholder="Deskripsi" />
              </div>

              <button type="submit" disabled={syncing} className="w-full bg-black text-yellow-400 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50">
                {syncing ? 'MENYIMPAN...' : 'SIMPAN KE CLOUD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
