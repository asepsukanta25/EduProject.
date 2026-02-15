
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  category: string;
  order: number;
  // Properti Baru
  actionType?: 'external' | 'internal';
  detailContent?: string;
  detailGallery?: string; // String URL dipisahkan koma
  detailVideo?: string; // Embed URL
}

export interface DeveloperProfile {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  email: string;
  linkedin: string;
  linkedinLabel?: string;
  github: string;
  githubLabel?: string;
  socialLabel?: string;
}

export enum StorageKey {
  PROJECTS = 'edu_projects',
  PROFILE = 'edu_profile'
}