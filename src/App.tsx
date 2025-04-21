import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllSections from './components/AllSections';
import SingleSection from './components/SingleSection';
import CombinedSections from './components/CombinedSections';
import RegistrationForm from './components/RegistrationForm';
import { useStudentStore } from './store/useStudentStore';
import { KeyRound } from 'lucide-react';
import backgroundImage from './images/Background.jpg';
import { SectionProvider } from './context/SectionContext';
import { SectionType } from './types';

function App() {
  const { sections, addStudent, fetchStudents } = useStudentStore();
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminKeyPressed, setAdminKeyPressed] = useState(0);

  // جلب بيانات الطلاب عند بدء التطبيق
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    let lastPress = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        const now = Date.now();
        if (now - lastPress < 500) {
          setAdminKeyPressed(prev => {
            if (prev === 2) {
              setShowAdmin(true);
              return 0;
            }
            return prev + 1;
          });
        } else {
          setAdminKeyPressed(1);
        }
        lastPress = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddStudent = async (name: string, section: SectionType) => {
    const result = await addStudent(name, section);
    return {
      success: result.success,
      message: result.message
    };
  };

  return (
    <SectionProvider>
      <Router>
        <div 
          className="w-full bg-cover bg-center bg-fixed bg-no-repeat flex flex-col p-4 sm:p-6 md:p-8"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            minHeight: '100vh'
          }}
        >
          <div className="w-full max-w-7xl mx-auto flex-grow">
            <Routes>
              <Route path="/" element={<AllSections sections={sections} />} />
              <Route path="/section/:sectionId" element={<SingleSection sections={sections} />} />
              <Route path="/combined-sections" element={<CombinedSections sections={sections} />} />
            </Routes>
          </div>

          {showAdmin && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl z-50 overflow-y-auto sm:w-full md:w-80 lg:w-96">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setShowAdmin(false)}
                    className="text-black hover:text-gray-700 text-sm sm:text-base"
                  >
                    إغلاق
                  </button>
                  <div className="flex items-center">
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-black mr-2" />
                    <span className="font-semibold text-black text-sm sm:text-base">لوحة التحكم</span>
                  </div>
                </div>
                <RegistrationForm onAddStudent={handleAddStudent} className="text-black shadow-sm" />
              </div>
            </div>
          )}
        </div>
      </Router>
    </SectionProvider>
  );
}

export default App;