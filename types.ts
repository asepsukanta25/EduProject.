
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
  github: string;
}

export enum StorageKey {
  PROJECTS = 'edu_projects',
  PROFILE = 'edu_profile'
}
