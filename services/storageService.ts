
import { Project, DeveloperProfile } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.image_url || item.imageUrl || '',
        externalUrl: item.external_url || item.externalUrl || '',
        category: item.category || '',
        order: typeof item.order === 'number' ? item.order : (typeof item.idx === 'number' ? item.idx : 0)
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Fetch Projects Error:', err);
      return [];
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    if (!supabase) throw new Error("Supabase tidak terhubung");
    
    const isNew = !project.id || project.id === '';
    
    const payload: any = {
      title: project.title,
      description: project.description,
      image_url: project.imageUrl,
      imageUrl: project.imageUrl,
      external_url: project.externalUrl,
      externalUrl: project.externalUrl,
      category: project.category,
      order: project.order
    };
    
    if (!isNew) {
      const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('projects').insert([payload]);
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
        photoUrl: data.photo_url || data.photoUrl || '',
        email: data.email || '',
        linkedin: data.linkedin || '',
        linkedinLabel: data.linkedin_label || data.linkedinLabel || '',
        github: data.github || '',
        githubLabel: data.github_label || data.githubLabel || '',
        socialLabel: data.social_label || data.socialLabel || ''
      };
    } catch (err) {
      console.error('Fetch Profile Error:', err);
      return null;
    }
  },

  saveProfile: async (profile: DeveloperProfile): Promise<void> => {
    if (!supabase) return;
    
    const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    
    const profilePayload: any = {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      photo_url: profile.photoUrl,
      photoUrl: profile.photoUrl,
      email: profile.email,
      linkedin: profile.linkedin,
      linkedin_label: profile.linkedinLabel,
      linkedinLabel: profile.linkedinLabel,
      github: profile.github,
      github_label: profile.githubLabel,
      githubLabel: profile.githubLabel,
      social_label: profile.socialLabel,
      socialLabel: profile.socialLabel
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