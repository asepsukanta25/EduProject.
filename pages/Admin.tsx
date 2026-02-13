
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
  const [isConnected, setIsConnected] = useState(true);
  
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
      setIsConnected(true);
      if (manual) {
        showNotification('Data terbaru berhasil ditarik dari Cloud!');
      }
    } catch (err: any) {
      setIsConnected(false);
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
            <p className="text-gray-500 mt-2">Mode Sinkronisasi Aman</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Kode Akses" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 focus:border-yellow-400 outline-none transition-all text-center text-2xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:font-bold"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-3 rounded-xl">{error}</p>}
            <button type="submit" className="w-full bg-black text-yellow-400 font-black text-lg py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-1">
              MASUK PANEL
            </button>
          </form>
          <p className="mt-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">EduProject Admin v2.1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
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

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-yellow-400 font-black text-2xl shadow-lg">E</div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Panel Kontrol</h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 status-pulse' : 'bg-red-500'}`}></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {isConnected ? 'Sistem Cloud Terhubung' : 'Koneksi Terputus'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => refreshData(true)} 
              disabled={syncing}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-black text-sm transition-all disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{syncing ? 'SINKRON...' : 'REFRESH'}</span>
            </button>
            <button 
              onClick={() => { setEditingProject({ id: '', title: '', description: '', imageUrl: '', externalUrl: '', category: 'Edukasi', order: (projects.length + 1) }); setShowProjectModal(true); }} 
              className="bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-yellow-200 hover:-translate-y-1 transition-all"
            >
              + TAMBAH PROYEK
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-4 rounded-2xl font-black text-sm transition-all">KELUAR</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Katalog Konten</h2>
                <span className="text-[10px] font-black bg-black text-yellow-400 px-3 py-1 rounded-full uppercase">{projects.length} Item</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                    <tr>
                      <th className="px-8 py-5 w-20">No</th>
                      <th className="px-8 py-5">Pratinjau & Judul</th>
                      <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.length === 0 && !syncing ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center">
                          <p className="text-gray-400 font-bold italic">Belum ada konten di Cloud.</p>
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id} className="hover:bg-yellow-50/20 transition-colors group">
                          <td className="px-8 py-6">
                            <span className="bg-gray-100 text-gray-500 text-[11px] font-black px-3 py-1.5 rounded-lg border border-gray-200">
                              #{project.order}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-5">
                              <div className="relative">
                                <img src={project.imageUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100 transition-transform group-hover:scale-110" alt="" />
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border border-white uppercase">{project.category}</div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{project.title}</div>
                                <div className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] mt-0.5">{project.externalUrl}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right space-x-2">
                            <button onClick={() => { setEditingProject(project); setShowProjectModal(true); }} className="p-3 bg-white hover:bg-yellow-400 hover:text-black border border-gray-100 rounded-xl font-black text-[10px] transition-all uppercase shadow-sm">Edit</button>
                            <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-white hover:bg-red-600 hover:text-white border border-gray-100 text-red-500 rounded-xl font-black text-[10px] transition-all uppercase shadow-sm">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Identitas Digital</span>
              </h2>
              {profile && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nama Display</label>
                    <input name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 font-bold text-sm border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Nama" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Keahlian / Role</label>
                    <input name="role" value={profile.role} onChange={handleProfileChange} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 font-bold text-sm border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Role" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Link Foto (URL)</label>
                    <input name="photoUrl" value={profile.photoUrl} onChange={handleProfileChange} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 text-xs font-medium border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Narasi Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all text-sm font-medium leading-relaxed" placeholder="Ceritakan tentang diri Anda..." />
                  </div>
                  <div className="pt-4">
                    <button onClick={handleSaveProfile} className="w-full bg-black text-yellow-400 font-black py-4 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6z" clipRule="evenodd" />
                      </svg>
                      <span>SIMPAN PROFIL</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Project */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-yellow-400 flex justify-between items-center">
              <h3 className="text-2xl font-black text-black tracking-tight">{editingProject.id ? 'Perbarui Konten' : 'Konten Baru'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="bg-black text-yellow-400 p-2 rounded-xl hover:rotate-90 transition-transform font-black w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Judul Proyek</label>
                  <input required value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Judul Proyek..." />
                </div>
                
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">No. Urut</label>
                  <input type="number" required value={editingProject.order} onChange={(e) => setEditingProject({...editingProject, order: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 rounded-2xl border-2 bg-black text-yellow-400 font-black focus:border-yellow-300 outline-none transition-all text-center" />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Kategori</label>
                  <input value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-black text-yellow-600 focus:border-yellow-400 outline-none transition-all" placeholder="Label..." />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">URL Gambar Utama</label>
                <input required value={editingProject.imageUrl} onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all text-xs font-medium" placeholder="https://picsum.photos/..." />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Tautan Aplikasi / Demo</label>
                <input required value={editingProject.externalUrl} onChange={(e) => setEditingProject({...editingProject, externalUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all text-xs font-medium" placeholder="https://aplikasi-anda.com" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Deskripsi Naratif</label>
                <textarea required rows={3} value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 resize-none focus:border-yellow-400 outline-none transition-all font-medium text-sm leading-relaxed" placeholder="Jelaskan proyek ini..." />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={syncing} className="w-full bg-black text-yellow-400 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 flex items-center justify-center space-x-3 text-lg">
                  {syncing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>PROSES SIMPAN...</span>
                    </>
                  ) : (
                    <span>SINKRON KE CLOUD</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;