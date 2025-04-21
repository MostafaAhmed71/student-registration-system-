import { useEffect, useState } from 'react';
import { useStudentStore } from './store/useStudentStore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SectionType } from './types';
import AllSections from './components/AllSections';
import SingleSection from './components/SingleSection';
import CombinedSections from './components/CombinedSections';
import RegistrationForm from './components/RegistrationForm';
import { SectionProvider } from './context/SectionContext';

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
      if (e.altKey) {
        e.preventDefault(); // منع السلوك الافتراضي
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
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/Background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        />

        {showAdmin && (
          <div className="fixed left-0 top-0 h-full z-20 bg-white/90 backdrop-blur-sm shadow-lg w-96 p-6 transition-all duration-300 ease-in-out">
            <button
              onClick={() => setShowAdmin(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="إغلاق"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <RegistrationForm onAddStudent={handleAddStudent} />
          </div>
        )}

        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <div className="w-full max-w-7xl mx-auto flex-grow">
            <Routes>
              <Route path="/" element={<AllSections sections={sections} />} />
              <Route 
                path="/section/:sectionId" 
                element={
                  <SectionProvider>
                    <SingleSection sections={sections} />
                  </SectionProvider>
                } 
              />
              <Route path="/combined-sections" element={<CombinedSections sections={sections} />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
