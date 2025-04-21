import React, { createContext, useContext, useState } from 'react';
import { Student } from '../types';
import { supabase } from '../lib/supabase';
interface CelebrationStudent extends Student {
  number: number;
}

interface SectionContextType {
  showCelebration: boolean;
  celebrationStudents: CelebrationStudent[];
  triggerCelebration: (students: CelebrationStudent[]) => void;
  endCelebration: () => void;
}

const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStudents, setCelebrationStudents] = useState<CelebrationStudent[]>([]);

  const triggerCelebration = (students: CelebrationStudent[]) => {
    console.log('Triggering celebration for students:', students);
    setCelebrationStudents(students);
    setShowCelebration(true);
  };

  const endCelebration = () => {
    setShowCelebration(false);
    setCelebrationStudents([]);
  };

  return (
    <SectionContext.Provider
      value={{
        showCelebration,
        celebrationStudents,
        triggerCelebration,
        endCelebration,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSectionContext must be used within a SectionProvider');
  }
  return context;
}; 