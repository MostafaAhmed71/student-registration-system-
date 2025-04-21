import { useEffect, useState } from 'react';
import { useStudentStore } from './store/useStudentStore';
import { Routes, Route } from 'react-router-dom';
import { SectionType } from './types';
import AllSections from './components/AllSections';
import SingleSection from './components/SingleSection';
import CombinedSections from './components/CombinedSections';
import RegistrationForm from './components/RegistrationForm';

function App() {
  const { sections, addStudent, fetchStudents, startAutoRefresh, stopAutoRefresh } = useStudentStore();
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminKeyPressed, setAdminKeyPressed] = useState(0);

  useEffect(() => {
    // بدء التحديث التلقائي عند تحميل التطبيق
    startAutoRefresh();

    // إيقاف التحديث التلقائي عند إغلاق التطبيق
    return () => stopAutoRefresh();
  }, [startAutoRefresh, stopAutoRefresh]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setAdminKeyPressed(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setShowAdmin(true);
            return 0;
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddStudent = async (name: string, section: SectionType) => {
    const result = await addStudent(name, section);
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            نظام تسجيل الطلاب
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {showAdmin && (
          <div className="mb-8">
            <RegistrationForm onAddStudent={handleAddStudent} />
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto flex-grow">
          <Routes>
            <Route path="/" element={<AllSections sections={sections} />} />
            <Route path="/section/:sectionId" element={<SingleSection sections={sections} />} />
            <Route path="/combined-sections" element={<CombinedSections sections={sections} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;