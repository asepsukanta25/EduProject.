
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  category: string;
  order: number;
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