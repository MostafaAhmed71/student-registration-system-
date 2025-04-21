export type SectionType = 'elementary' | 'middle' | 'secondary' | 'universal';

export interface Student {
  id: string;
  name: string;
}

export interface SectionData {
  id: SectionType;
  title: string;
  color: string;
  students: (Student | null)[];
}