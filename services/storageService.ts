
import { Project, DeveloperProfile } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      if (!data) return [];

      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.imageUrl || item.image_url || '',
        externalUrl: item.externalUrl || item.external_url || '',
        category: item.category || '',
        order: typeof item.order === 'number' ? item.order : (typeof item.idx === 'number' ? item.idx : 0)
      }));

      return mappedData.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Fetch Projects Error:', err);
      return [];
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    if (!supabase) throw new Error("Supabase tidak terhubung");
    
    const isNew = !project.id || project.id === '';
    
    // Kirim payload dalam format camelCase DAN snake_case agar kompatibel dengan tabel manapun
    const payload: any = {
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      image_url: project.imageUrl, // snake_case fallback
      externalUrl: project.externalUrl,
      external_url: project.externalUrl, // snake_case fallback
      category: project.category,
      order: project.order,
      idx: project.order // fallback untuk kolom idx
    };
    
    if (!isNew) {
      const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
      if (error) throw error;
    } else {
      const { id, ...newData } = payload;
      const { error } = await supabase.from('projects').insert([newData]);
      if (error) throw error;
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
      if (!data) return null;
      
      return {
        name: data.name || '',
        role: data.role || '',
        bio: data.bio || '',
        photoUrl: data.photoUrl || data.photo_url || '',
        email: data.email || '',
        linkedin: data.linkedin || '',
        github: data.github || ''
      };
    } catch (err) {
      console.error('Fetch Profile Error:', err);
      return null;
    }
  },

  saveProfile: async (profile: DeveloperProfile): Promise<void> => {
    if (!supabase) return;
    const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    
    // Kirim payload ganda (camelCase & snake_case)
    const profilePayload = {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      photoUrl: profile.photoUrl,
      photo_url: profile.photoUrl, // fallback
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github
    };

    if (existing) {
      const { error } = await supabase.from('profiles').update(profilePayload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('profiles').insert([profilePayload]);
      if (error) throw error;
    }
  }
};
