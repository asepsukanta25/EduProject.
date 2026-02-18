
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
        order: typeof item.order === 'number' ? item.order : 0,
        actionType: item.action_type || 'external',
        detailContent: item.detail_content || '',
        detailGallery: item.detail_gallery || '',
        detailVideo: item.detail_video || ''
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Fetch Projects Error:', err);
      return [];
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.image_url || data.imageUrl || '',
        externalUrl: data.external_url || data.externalUrl || '',
        category: data.category || '',
        order: data.order || 0,
        actionType: data.action_type || 'external',
        detailContent: data.detail_content || '',
        detailGallery: data.detail_gallery || '',
        detailVideo: data.detail_video || ''
      };
    } catch (err) {
      console.error('Fetch Project Detail Error:', err);
      return null;
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    if (!supabase) throw new Error("Supabase tidak terhubung");
    
    const isNew = !project.id || project.id === '';
    
    const payload = {
      title: project.title,
      description: project.description,
      image_url: project.imageUrl,
      external_url: project.externalUrl,
      category: project.category,
      order: project.order,
      action_type: project.actionType || 'external',
      detail_content: project.detailContent || '',
      detail_gallery: project.detailGallery || '',
      detail_video: project.detailVideo || ''
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
        appLogoUrl: data.app_logo_url || data.appLogoUrl || '', // Tambahan logo
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
    
    const profilePayload = {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      photo_url: profile.photoUrl,
      app_logo_url: profile.appLogoUrl, // Simpan logo
      email: profile.email,
      linkedin: profile.linkedin,
      linkedin_label: profile.linkedinLabel,
      github: profile.github,
      github_label: profile.githubLabel,
      social_label: profile.socialLabel
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
