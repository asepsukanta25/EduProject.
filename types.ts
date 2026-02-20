
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

export interface LayoutSettings {
  columnsDesktop: number;
  columnsTablet: number;
  columnsMobile: number;
  gap: number;
  isAutoFit: boolean;
  preset: 'standard' | 'adaptive' | 'masonry' | 'custom';
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  cardColor: string;
  borderRadius: string;
}

export interface DeveloperProfile {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  appLogoUrl?: string; // Properti baru untuk logo aplikasi
  email: string;
  linkedin: string;
  linkedinLabel?: string;
  github: string;
  githubLabel?: string;
  socialLabel?: string;
  layoutSettings?: LayoutSettings;
  themeSettings?: ThemeSettings;
}

export enum StorageKey {
  PROJECTS = 'edu_projects',
  PROFILE = 'edu_profile'
}
