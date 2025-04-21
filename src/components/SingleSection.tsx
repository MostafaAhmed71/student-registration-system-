import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SectionData, Student } from '../types';
import { ArrowRight, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import CelebrationView from './CelebrationView';
import { useSectionContext } from '../context/SectionContext';

interface SingleSectionProps {
  sections: SectionData[];
}

const SingleSection: React.FC<SingleSectionProps> = ({ sections }) => {
  const { sectionId } = useParams();
  const section = sections.find(s => s.id === sectionId);
  const { showCelebration, celebrationStudents, triggerCelebration, endCelebration } = useSectionContext();
  
  // العثور على القسم السابق والتالي
  const currentIndex = sections.findIndex(s => s.id === sectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  // تتبع التغييرات في القسم
  useEffect(() => {
    if (section) {
      const currentStudents = section.students.filter((s): s is Student => s !== null);
      const storedKey = `section-${section.id}-count`;
      const storedCount = parseInt(localStorage.getItem(storedKey) || '0');
      
      if (currentStudents.length > storedCount) {
        // تم إضافة طلاب جدد
        const newStudents = currentStudents.slice(storedCount);
        const startNumber = storedCount + 1; // رقم بداية المتأهلين الجدد
        console.log('New students detected:', newStudents, 'Starting from number:', startNumber);
        triggerCelebration(newStudents.map((student, index) => ({
          ...student,
          number: startNumber + index // إضافة رقم المتأهل لكل طالب
        })));
      }
      
      localStorage.setItem(storedKey, currentStudents.length.toString());
    }
  }, [section?.students, section?.id, triggerCelebration]);

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-6">القسم غير موجود</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300"
          >
            <ArrowRight className="ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const filledSeats = section.students.filter(s => s).length;
  const totalSeats = section.students.length;
  const progress = (filledSeats / totalSeats) * 100;

  return (
    <>
      <div className={`min-h-screen flex items-center transition-opacity duration-1000 ${showCelebration ? 'opacity-30' : 'opacity-100'}`} dir="rtl">
        <div className="w-full max-w-6xl mx-auto p-8">
          {/* رأس القسم */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="text-white/80 hover:text-white flex items-center transition-colors"
            >
              <ArrowRight className="ml-2 w-5 h-5" />
              <span>الرئيسية</span>
            </Link>
            <div className="flex items-center gap-4">
              {prevSection && (
                <Link
                  to={`/section/${prevSection.id}`}
                  className="text-white/80 hover:text-white flex items-center transition-colors"
                >
                  <ChevronRight className="ml-1 w-5 h-5" />
                  <span>القسم السابق</span>
                </Link>
              )}
              {nextSection && (
                <Link
                  to={`/section/${nextSection.id}`}
                  className="text-white/80 hover:text-white flex items-center transition-colors"
                >
                  <span>القسم التالي</span>
                  <ChevronLeft className="mr-1 w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* معلومات القسم */}
          <div 
            className="relative rounded-2xl overflow-hidden mb-8 p-8"
            style={{ backgroundColor: section.color }}
          >
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                {section.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-black/20 rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-white ml-2" />
                  <span className="text-white font-medium">
                    {filledSeats} من {totalSeats} طالب
                  </span>
                </div>
                <div className="flex-1 bg-black/20 rounded-lg p-2">
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          </div>

          {/* قائمة الطلاب */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.students.map((student, index) => (
              <div
                key={`${section.id}-slot-${index}`}
                className={`
                  relative p-6 rounded-xl flex flex-col items-center justify-center
                  min-h-[200px] transition-all duration-300 transform hover:scale-105
                  ${student
                    ? 'bg-white/10 backdrop-blur-sm shadow-lg'
                    : 'bg-white/5 border-2 border-dashed border-white/20'
                  }
                `}
              >
                <div 
                  className={`
                    w-16 h-16 mb-4 rounded-full flex items-center justify-center text-2xl font-bold
                    ${student ? 'bg-white/20' : 'bg-white/5'}
                  `}
                  style={{ color: section.color }}
                >
                  {index + 1}
                </div>
                {student ? (
                  <div className="text-center">
                    <div className="text-xl text-white font-bold mb-2">
                      {student.name}
                    </div>
                    <div className="text-white/60 text-sm">
                      طالب مسجل
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-lg text-white/60 font-medium mb-2">
                      مقعد شاغر
                    </div>
                    <div className="text-white/40 text-sm">
                      متاح للتسجيل
                    </div>
                  </div>
                )}
                {student && (
                  <div 
                    className="absolute inset-0 rounded-xl opacity-10"
                    style={{
                      background: `radial-gradient(circle at center, ${section.color} 0%, transparent 70%)`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCelebration && celebrationStudents.length > 0 && (
        <CelebrationView
          students={celebrationStudents}
          onComplete={endCelebration}
          sectionColor={section.color}
        />
      )}
    </>
  );
};

export default SingleSection;