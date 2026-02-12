
import { Project, DeveloperProfile } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
      // Ambil data dari tabel 'projects'
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        console.error('Supabase Fetch Error:', error.message);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('Database terhubung tapi tabel "projects" kosong atau RLS aktif.');
        return [];
      }

      console.log('Data mentah dari Supabase:', data);

      // Mapping data agar kompatibel dengan interface Project di aplikasi
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Tanpa Judul',
        description: item.description || '',
        imageUrl: item.imageUrl || item.image_url || '',
        externalUrl: item.externalUrl || item.external_url || '',
        category: item.category || '',
        // Gunakan 'order', jika tidak ada cari 'idx', jika tidak ada gunakan 0
        order: typeof item.order === 'number' ? item.order : (typeof item.idx === 'number' ? item.idx : 0)
      }));

      // Urutkan berdasarkan property order
      return mappedData.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Gagal memuat data proyek:', err);
      return [];
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    if (!supabase) throw new Error("Supabase tidak terhubung");
    
    const isNew = !project.id || project.id === '';
    
    // Siapkan payload yang fleksibel untuk database lama (idx) maupun baru (order)
    const payload: any = {
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      externalUrl: project.externalUrl,
      category: project.category,
      order: project.order
    };
    
    try {
      if (!isNew) {
        const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
        if (error) throw error;
      } else {
        // Hapus ID agar Supabase generate UUID otomatis
        const { id, ...newData } = payload;
        const { error } = await supabase.from('projects').insert([newData]);
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Save Error:', err);
      
      // Fallback jika database hanya punya kolom 'idx'
      if (err.message?.includes('column "order" does not exist')) {
        const { order, ...fallbackData } = payload;
        const finalData = { ...fallbackData, idx: project.order };
        if (isNew) {
          await supabase.from('projects').insert([finalData]);
        } else {
          await supabase.from('projects').update(finalData).eq('id', project.id);
        }
      } else {
        throw new Error(err.message || "Gagal menyimpan data");
      }
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  getProfile: async (): Promise<DeveloperProfile | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  },

  saveProfile: async (profile: DeveloperProfile): Promise<void> => {
    if (!supabase) return;
    const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    const { ...profileData } = profile as any;

    if (existing) {
      await supabase.from('profiles').update(profileData).eq('id', existing.id);
    } else {
      await supabase.from('profiles').insert([profileData]);
    }
  }
};
