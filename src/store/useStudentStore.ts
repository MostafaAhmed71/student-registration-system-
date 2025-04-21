import { create, StateCreator } from 'zustand';
import { SectionData, Student, SectionType } from '../types';

interface StudentStore {
  sections: SectionData[];
  addStudent: (name: string, sectionId: SectionType) => Promise<{ success: boolean; message?: string }>;
  fetchStudents: () => Promise<void>;
  deleteStudent: (studentId: string, sectionId: SectionType, position: number) => Promise<{ success: boolean; message?: string }>;
}

const STORAGE_KEY = 'student-sections';

const initialSections: SectionData[] = [
  {
    id: 'elementary',
    title: 'القسم الابتدائي',
    color: '#4CAF50', // أخضر
    students: Array(15).fill(null),
  },
  {
    id: 'middle',
    title: 'القسم المتوسط',
    color: '#2196F3', // أزرق
    students: Array(15).fill(null),
  },
  {
    id: 'secondary',
    title: 'القسم الثانوي',
    color: '#9C27B0', // بنفسجي
    students: Array(15).fill(null),
  },
  {
    id: 'universal',
    title: 'القسم العالمي',
    color: '#FF9800', // برتقالي
    students: Array(15).fill(null),
  },
];

// حفظ البيانات في التخزين المحلي
const saveToStorage = (sections: SectionData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
};

// استرجاع البيانات من التخزين المحلي
const loadFromStorage = (): SectionData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialSections;
  
  // تحويل البيانات المخزنة إلى النموذج الجديد
  const parsedSections = JSON.parse(stored);
  return parsedSections.map((section: SectionData) => ({
    ...section,
    students: Array(15).fill(null).map((_, i) => 
      i < section.students.length ? section.students[i] : null
    ),
  }));
};

const createStudentStore: StateCreator<StudentStore> = (set, get) => ({
  sections: loadFromStorage(),

  fetchStudents: async () => {
    set({ sections: loadFromStorage() });
  },

  deleteStudent: async (studentId: string, sectionId: SectionType, position: number) => {
    try {
      const sections = [...get().sections];
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) {
        return { success: false, message: 'القسم غير موجود' };
      }

      // إزالة الطالب وتحديث المواقع
      const section = sections[sectionIndex];
      section.students[position - 1] = null;

      // تحريك الطلاب الباقين للأمام
      for (let i = position - 1; i < section.students.length - 1; i++) {
        if (section.students[i + 1]) {
          section.students[i] = section.students[i + 1];
          section.students[i + 1] = null;
        }
      }

      // حفظ التغييرات
      set({ sections });
      saveToStorage(sections);

      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { success: false, message: 'حدث خطأ أثناء الحذف' };
    }
  },

  addStudent: async (name: string, sectionId: SectionType) => {
    try {
      const sections = [...get().sections];
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) {
        return { success: false, message: 'القسم غير موجود' };
      }

      const section = sections[sectionIndex];
      const emptySlotIndex = section.students.findIndex(s => s === null);

      if (emptySlotIndex === -1) {
        return { success: false, message: 'القسم ممتلئ' };
      }

      const isDuplicate = section.students.some(
        student => student && student.name === name
      );

      if (isDuplicate) {
        return { success: false, message: 'الاسم موجود بالفعل في هذا القسم' };
      }

      // إضافة الطالب
      section.students[emptySlotIndex] = {
        id: `${sectionId}-${Date.now()}`,
        name: name.trim(),
      };

      // حفظ التغييرات
      set({ sections });
      saveToStorage(sections);

      return { success: true };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, message: 'حدث خطأ أثناء التسجيل' };
    }
  },
});

export const useStudentStore = create(createStudentStore);