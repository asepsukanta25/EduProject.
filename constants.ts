
import { Project, DeveloperProfile } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Platform Belajar Matematika',
    description: 'Aplikasi interaktif untuk membantu siswa memahami konsep kalkulus dengan visualisasi dinamis.',
    imageUrl: 'https://picsum.photos/seed/math/600/400',
    externalUrl: 'https://example.com/math',
    category: 'Sains'
  },
  {
    id: '2',
    title: 'Laboratorium Kimia Virtual',
    description: 'Eksperimen kimia aman dalam lingkungan 3D untuk siswa sekolah menengah.',
    imageUrl: 'https://picsum.photos/seed/chem/600/400',
    externalUrl: 'https://example.com/chem',
    category: 'Sains'
  },
  {
    id: '3',
    title: 'Sejarah Indonesia Interaktif',
    description: 'Garis waktu sejarah Nusantara dengan aset multimedia yang menarik.',
    imageUrl: 'https://picsum.photos/seed/history/600/400',
    externalUrl: 'https://example.com/history',
    category: 'Sosial'
  }
];

export const INITIAL_PROFILE: DeveloperProfile = {
  name: 'Andi Pratama',
  role: 'Senior Educational Developer',
  bio: 'Bersemangat dalam membangun solusi teknologi yang mempercepat proses pembelajaran di era digital. Berpengalaman lebih dari 5 tahun dalam pengembangan kurikulum digital.',
  photoUrl: 'https://picsum.photos/seed/dev/400/400',
  email: 'andi@eduproject.id',
  linkedin: 'https://linkedin.com/in/andipratama',
  github: 'https://github.com/andipratama'
};
