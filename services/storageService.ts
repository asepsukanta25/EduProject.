
import { Project, DeveloperProfile } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true }); // Diurutkan berdasarkan nomor urutan (1, 2, 3...)
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Database Error:', err);
      return [];
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    if (!supabase) return;
    
    const { id, ...data } = project;
    
    if (id) {
      const { error } = await supabase.from('projects').update(data).eq('id', id);
      if (error) console.error('Update error:', error);
    } else {
      const { error } = await supabase.from('projects').insert([data]);
      if (error) console.error('Insert error:', error);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    if (!supabase) return;
    await supabase.from('projects').delete().eq('id', id);
  },

  getProfile: async (): Promise<DeveloperProfile | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  },

  saveProfile: async (profile: DeveloperProfile): Promise<void> => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      const { id, ...profileData } = profile as any;

      if (existing) {
        await supabase.from('profiles').update(profileData).eq('id', existing.id);
      } else {
        await supabase.from('profiles').insert([profileData]);
      }
    } catch (err) {
      console.error('Profile save error:', err);
    }
  }
};
