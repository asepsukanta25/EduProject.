
import { Project, DeveloperProfile, DownloadItem } from '../types';
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
        socialLabel: data.social_label || data.socialLabel || '',
        layoutSettings: data.layout_settings ? (typeof data.layout_settings === 'string' ? JSON.parse(data.layout_settings) : data.layout_settings) : undefined,
        themeSettings: data.theme_settings ? (typeof data.theme_settings === 'string' ? JSON.parse(data.theme_settings) : data.theme_settings) : undefined
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
      social_label: profile.socialLabel,
      layout_settings: profile.layoutSettings ? JSON.stringify(profile.layoutSettings) : null,
      theme_settings: profile.themeSettings ? JSON.stringify(profile.themeSettings) : null
    };

    if (existing) {
      const { error } = await supabase.from('profiles').update(profilePayload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('profiles').insert([profilePayload]);
      if (error) throw error;
    }
  },

  // --- RESOURCES / DOWNLOADS ---
  async getResources(): Promise<DownloadItem[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Gagal mengambil resource:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      fileUrl: item.file_url,
      fileType: item.file_type as 'excel' | 'json',
      order: item.order
    }));
  },

  async saveResource(resource: Partial<DownloadItem>): Promise<boolean> {
    const payload = {
      title: resource.title,
      description: resource.description,
      file_url: resource.fileUrl,
      file_type: resource.fileType,
      order: resource.order || 0
    };

    let result;
    if (resource.id) {
      result = await supabase
        .from('resources')
        .update(payload)
        .eq('id', resource.id);
    } else {
      result = await supabase
        .from('resources')
        .insert([payload]);
    }

    if (result.error) {
      console.error('Gagal menyimpan resource:', result.error);
      return false;
    }
    return true;
  },

  async deleteResource(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal menghapus resource:', error);
      return false;
    }
    return true;
  }
};
