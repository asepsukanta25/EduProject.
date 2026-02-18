
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

      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-yellow-400 font-black text-xl shadow-lg">
              {profile?.appLogoUrl ? (
                <img src={profile.appLogoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : 'E'}
            </div>
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
              onClick={() => { setEditingProject({ id: '', title: '', description: '', imageUrl: '', externalUrl: '', category: '', order: (projects.length + 1), actionType: 'external' }); setShowProjectModal(true); }} 
              className="flex-1 md:flex-none bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-yellow-200 hover:-translate-y-1 transition-all"
            >
              + TAMBAH KONTEN
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-sm hover:bg-red-100 transition-all uppercase tracking-tight">Keluar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Katalog Proyek */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden h-full">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Katalog Konten</h2>
                <span className="text-[10px] font-black bg-black text-yellow-400 px-3 py-1 rounded-full uppercase">{projects.length} Item</span>
              </div>
              
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
                            <img src={project.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100 bg-gray-100" alt="" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=Error")} />
                            <div>
                              <div className="font-bold text-gray-900">{project.title}</div>
                              <div className="text-[10px] font-black text-yellow-600 uppercase">
                                {project.actionType === 'internal' ? '👁️ Detail Halaman' : '🔗 Link Langsung'}
                              </div>
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

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-gray-50">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="bg-black text-yellow-400 text-[10px] font-black px-2 py-1 rounded">#{project.order}</span>
                        <div className="font-bold text-gray-900 text-sm">{project.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <img src={project.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-gray-100 bg-gray-100" alt="" />
                      <div className="flex-1 space-y-2">
                        <button onClick={() => { setEditingProject(project); setShowProjectModal(true); }} className="w-full bg-white border-2 border-yellow-400 text-black py-2.5 rounded-xl font-black text-xs uppercase shadow-sm transition-all flex items-center justify-center space-x-2">EDIT</button>
                        <button onClick={() => handleDeleteProject(project.id)} className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-black text-[10px] uppercase">HAPUS</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic font-bold">Belum ada konten proyek.</div>
              )}
            </div>
          </div>

          {/* Pengaturan Profil & Branding */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-3">
                <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm shadow-sm">👤</span>
                <span>IDENTITAS & BRANDING</span>
              </h2>
              
              {profile && (
                <div className="space-y-6">
                  {/* Logo Aplikasi Section */}
                  <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 space-y-3">
                    <label className="text-[10px] font-black text-yellow-700 uppercase ml-1">URL Logo Aplikasi (Header/Footer)</label>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-yellow-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {profile.appLogoUrl ? (
                          <img src={profile.appLogoUrl} className="w-full h-full object-contain p-1" alt="Logo Preview" />
                        ) : (
                          <span className="font-black text-lg">E</span>
                        )}
                      </div>
                      <input 
                        name="appLogoUrl" 
                        value={profile.appLogoUrl || ''} 
                        onChange={handleProfileChange} 
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:border-yellow-400 outline-none" 
                        placeholder="https://link-ke-logo.png" 
                      />
                    </div>
                  </div>

                  {/* Foto Profil */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-inner flex-shrink-0 border-2 border-white">
                      {profile.photoUrl ? (
                        <img src={profile.photoUrl} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=Error")} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase text-center p-2">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">URL Foto Profil</label>
                      <input name="photoUrl" value={profile.photoUrl} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs focus:border-yellow-400 outline-none" placeholder="https://..." />
                    </div>
                  </div>

                  {/* Data Dasar */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Lengkap</label>
                      <input name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jabatan / Peran</label>
                      <input name="role" value={profile.role} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Bio Singkat</label>
                      <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-medium text-sm border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="Tuliskan kata pengantar Anda..." />
                    </div>
                  </div>

                  {/* Kontak & Sosial */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Informasi Kontak</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email</label>
                      <input name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Label Kontak Sosial (Stack)</label>
                      <input name="socialLabel" value={profile.socialLabel} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold border-2 border-transparent focus:border-yellow-400 outline-none transition-all" placeholder="@username atau label lainnya" />
                    </div>
                  </div>

                  {/* Tombol Media Sosial */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Tombol Media Sosial</h3>
                    
                    {/* Tombol 1 (LinkedIn) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Label Tombol 1</label>
                        <input name="linkedinLabel" value={profile.linkedinLabel} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-xs font-bold border-2 border-transparent focus:border-yellow-400 outline-none" placeholder="Contoh: Instagram" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">URL Tombol 1</label>
                        <input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-[10px] border-2 border-transparent focus:border-yellow-400 outline-none" placeholder="https://..." />
                      </div>
                    </div>

                    {/* Tombol 2 (GitHub/Lainnya) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Label Tombol 2</label>
                        <input name="githubLabel" value={profile.githubLabel} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-xs font-bold border-2 border-transparent focus:border-yellow-400 outline-none" placeholder="Contoh: WhatsApp" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">URL Tombol 2</label>
                        <input name="github" value={profile.github} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-[10px] border-2 border-transparent focus:border-yellow-400 outline-none" placeholder="https://..." />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveProfile} 
                    disabled={syncing}
                    className="w-full bg-black text-yellow-400 font-black py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50"
                  >
                    {syncing ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Edit/Add Modal */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-yellow-400 flex justify-between items-center flex-shrink-0 shadow-lg">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">{editingProject.id ? 'Edit Konten Proyek' : 'Tambah Konten Baru'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="bg-black text-yellow-400 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">✕</button>
            </div>
            
            <form onSubmit={handleSaveProject} className="p-8 space-y-6 overflow-y-auto">
              {/* Basic Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Judul Utama</label>
                    <input required value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Nama Proyek/Aplikasi" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Kategori</label>
                    <input value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Contoh: Media Pembelajaran" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-yellow-400/20 relative shadow-inner">
                    {editingProject.imageUrl ? (
                      <img src={editingProject.imageUrl} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300?text=Error")} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-black p-4 text-center">PRATINJAU GAMBAR UTAMA</div>
                    )}
                  </div>
                  <input required placeholder="URL Gambar Kartu (Preview)" value={editingProject.imageUrl} onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full px-5 py-3 rounded-xl border-2 bg-gray-50 text-xs font-medium focus:border-yellow-400 outline-none" />
                </div>
              </div>

              {/* Action Choice */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-4 text-center">Pilihan Aksi Saat Diklik Di Beranda</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingProject({...editingProject, actionType: 'external'})}
                    className={`p-4 rounded-2xl border-2 transition-all font-black text-sm flex flex-col items-center gap-2 ${editingProject.actionType !== 'internal' ? 'border-yellow-400 bg-white shadow-md' : 'border-transparent bg-gray-100 opacity-60'}`}
                  >
                    <span className="text-2xl">🔗</span> Link Eksternal
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingProject({...editingProject, actionType: 'internal'})}
                    className={`p-4 rounded-2xl border-2 transition-all font-black text-sm flex flex-col items-center gap-2 ${editingProject.actionType === 'internal' ? 'border-yellow-400 bg-white shadow-md' : 'border-transparent bg-gray-100 opacity-60'}`}
                  >
                    <span className="text-2xl">👁️</span> Halaman Detail
                  </button>
                </div>
              </div>

              {/* Dynamic Sections Based on Action */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Tautan Tujuan Utama (External URL)</label>
                  <input required value={editingProject.externalUrl} onChange={(e) => setEditingProject({...editingProject, externalUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 text-xs font-medium" placeholder="https://aplikasi-anda.com" />
                </div>

                {editingProject.actionType === 'internal' && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="bg-yellow-50/30 p-6 rounded-3xl space-y-4 border border-yellow-100 shadow-inner">
                      <h4 className="text-xs font-black text-yellow-700 uppercase tracking-widest flex items-center">
                        <span className="mr-2">📝</span> Konten Halaman Detail Kustom
                      </h4>
                      
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase ml-1 block mb-1">Deskripsi Panjang (Detail Produk)</label>
                        <textarea rows={5} value={editingProject.detailContent} onChange={(e) => setEditingProject({...editingProject, detailContent: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-white text-sm font-medium focus:border-yellow-400 outline-none" placeholder="Ceritakan fitur, cara penggunaan, dan tujuan aplikasi secara mendalam..." />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase ml-1 block mb-1">Galeri Gambar Detail (Pisahkan URL dengan Koma)</label>
                        <textarea rows={2} value={editingProject.detailGallery} onChange={(e) => setEditingProject({...editingProject, detailGallery: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-white text-[10px] font-mono" placeholder="https://img1.jpg, https://img2.jpg, https://img3.jpg" />
                        <p className="text-[9px] text-gray-400 mt-1 italic font-bold">Grid foto akan menyesuaikan jumlah URL yang Anda masukkan.</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase ml-1 block mb-1">URL Video Presentasi (Embed)</label>
                        <input value={editingProject.detailVideo} onChange={(e) => setEditingProject({...editingProject, detailVideo: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-white text-xs font-medium" placeholder="https://www.youtube.com/embed/KODE_VIDEO" />
                        <p className="text-[9px] text-gray-400 mt-1 italic font-bold">*WAJIB gunakan URL versi 'embed' YouTube agar video tampil.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Ringkasan Singkat (Muncul di Kartu Beranda)</label>
                  <textarea required rows={2} value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 text-sm font-medium" placeholder="Teks singkat penarik perhatian di kartu proyek..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">Nomor Urutan Tampil</label>
                    <input type="number" required value={editingProject.order} onChange={(e) => setEditingProject({...editingProject, order: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 rounded-2xl border-2 bg-black text-yellow-400 font-black text-center text-xl" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={syncing} className="w-full bg-black text-yellow-400 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-400 hover:text-black transition-all flex-shrink-0 active:scale-95">
                {syncing ? 'PROSES MENYIMPAN...' : 'SIMPAN KE DATABASE CLOUD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
