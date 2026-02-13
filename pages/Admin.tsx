
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
        showNotification('Data terbaru berhasil ditarik!');
      }
    } catch (err: any) {
      setIsConnected(false);
      showNotification('Gagal menarik data', true);
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
      showNotification('Konten berhasil disimpan!');
    } catch (err: any) {
      showNotification('Gagal simpan: ' + (err.message || 'Error'), true);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Hapus proyek ini secara permanen?')) {
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
      showNotification('Profil diperbarui!');
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
            <input 
              type="password" 
              placeholder="Kode Akses" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 focus:border-yellow-400 outline-none transition-all text-center text-2xl font-black tracking-[0.5em]"
            />
            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-3 rounded-xl">{error}</p>}
            <button type="submit" className="w-full bg-black text-yellow-400 font-black text-lg py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all">
              MASUK PANEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${toast.isError ? 'bg-red-600' : 'bg-black'} text-yellow-400 px-8 py-4 rounded-2xl shadow-2xl border-2 border-yellow-400/20 flex items-center space-x-3`}>
            <span className="font-black tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-yellow-400 font-black text-xl shadow-lg">E</div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Dashboard Konten</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 status-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  {isConnected ? 'Terhubung' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <button 
              onClick={() => { setEditingProject({ id: '', title: '', description: '', imageUrl: '', externalUrl: '', category: '', order: (projects.length + 1) }); setShowProjectModal(true); }} 
              className="flex-1 md:flex-none bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-yellow-200 hover:-translate-y-1 transition-all"
            >
              + TAMBAH
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-sm hover:bg-red-100 transition-all uppercase tracking-tight">Keluar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Katalog Konten</h2>
                <span className="text-[10px] font-black bg-black text-yellow-400 px-3 py-1 rounded-full uppercase">{projects.length} Item</span>
              </div>
              
              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                    <tr>
                      <th className="px-8 py-5 w-20">No</th>
                      <th className="px-8 py-5">Proyek</th>
                      <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-yellow-50/20 transition-colors">
                        <td className="px-8 py-6">
                          <span className="bg-gray-100 text-gray-500 text-[11px] font-black px-3 py-1.5 rounded-lg border border-gray-200">#{project.order}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <img src={project.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" alt="" />
                            <div>
                              <div className="font-bold text-gray-900">{project.title}</div>
                              <div className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{project.externalUrl}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => { setEditingProject(project); setShowProjectModal(true); }} className="p-3 bg-white hover:bg-yellow-400 border border-gray-100 rounded-xl font-black text-[10px] uppercase shadow-sm transition-all">Edit</button>
                          <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-white hover:bg-red-600 hover:text-white border border-gray-100 text-red-500 rounded-xl font-black text-[10px] uppercase shadow-sm transition-all">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View List */}
              <div className="md:hidden divide-y divide-gray-50">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="bg-black text-yellow-400 text-[10px] font-black px-2 py-1 rounded">#{project.order}</span>
                        <div className="font-bold text-gray-900 text-sm">{project.title}</div>
                      </div>
                      <span className="text-[10px] font-black bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded uppercase">{project.category || 'Global'}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <img src={project.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-gray-100" alt="" />
                      <div className="flex-1 space-y-2">
                        <button 
                          onClick={() => { setEditingProject(project); setShowProjectModal(true); }}
                          className="w-full bg-white border-2 border-yellow-400 text-black py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center space-x-2 active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>EDIT KONTEN</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center space-x-2 active:scale-95"
                        >
                          HAPUS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic">Belum ada konten.</div>
              )}
            </div>
          </div>

          {/* Sidebar Profile */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>IDENTITAS DIGITAL</span>
              </h2>
              {profile && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Tampilan</label>
                    <input name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold text-sm border-2 border-transparent focus:border-yellow-400 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Bio Singkat</label>
                    <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all text-sm font-medium" />
                  </div>
                  <button onClick={handleSaveProfile} className="w-full bg-black text-yellow-400 font-black py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:text-black transition-all">SIMPAN PROFIL</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit / Tambah */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-yellow-400 flex justify-between items-center">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">{editingProject.id ? 'Edit Konten' : 'Tambah Konten'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="bg-black text-yellow-400 w-10 h-10 rounded-xl flex items-center justify-center font-black">✕</button>
            </div>
            
            <form onSubmit={handleSaveProject} className="p-8 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Judul Konten</label>
                  <input required value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Contoh: EduCBT Pro..." />
                </div>
                
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Urutan</label>
                  <input type="number" required value={editingProject.order} onChange={(e) => setEditingProject({...editingProject, order: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 rounded-2xl border-2 bg-black text-yellow-400 font-black focus:border-yellow-300 outline-none transition-all text-center" />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Label / Tag</label>
                  <input value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-black text-yellow-600 focus:border-yellow-400 outline-none transition-all" placeholder="Contoh: LYNK..." />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Tautan Aplikasi (Link)</label>
                <input required value={editingProject.externalUrl} onChange={(e) => setEditingProject({...editingProject, externalUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all text-xs font-medium" placeholder="https://..." />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">URL Gambar Pratinjau</label>
                <input required value={editingProject.imageUrl} onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all text-xs font-medium" placeholder="https://..." />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Narasi Deskripsi</label>
                <textarea required rows={2} value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 focus:border-yellow-400 outline-none transition-all font-medium text-sm" placeholder="Jelaskan isi konten..." />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={syncing} className="w-full bg-black text-yellow-400 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50">
                  {syncing ? 'MENYIMPAN...' : 'SIMPAN KE CLOUD'}
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
