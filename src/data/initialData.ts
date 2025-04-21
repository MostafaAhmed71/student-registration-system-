import { SectionData } from '../types';

// Initial data structure with empty slots for each section
export const initialSections: SectionData[] = [
  {
    id: 'elementary',
    title: 'الابتدائي',
    color: '#4F46E5', // Indigo
    students: Array(15).fill(null),
  },
  {
    id: 'middle',
    title: 'المتوسط',
    color: '#0891B2', // Cyan
    students: Array(15).fill(null),
  },
  {
    id: 'secondary',
    title: 'الثانوي',
    color: '#7C3AED', // Violet
    students: Array(15).fill(null),
  },
  {
    id: 'universal',
    title: 'العالمي',
    color: '#059669', // Emerald
    students: Array(15).fill(null),
  },
];