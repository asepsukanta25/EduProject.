
import { Project, DeveloperProfile } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  saveProject: async (project: Project): Promise<void> => {
    if (project.id) {
      await supabase.from('projects').update(project).eq('id', project.id);
    } else {
      const { id, ...newProject } = project;
      await supabase.from('projects').insert([newProject]);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    await supabase.from('projects').delete().eq('id', id);
  },

  getProfile: async (): Promise<DeveloperProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  saveProfile: async (profile: DeveloperProfile): Promise<void> => {
    await supabase.from('profiles').upsert(profile);
  }
};
