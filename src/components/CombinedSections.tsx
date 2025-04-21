import React from 'react';
import { Link } from 'react-router-dom';
import { SectionData } from '../types';
import { ArrowRight } from 'lucide-react';

interface CombinedSectionsProps {
  sections: SectionData[];
}

const CombinedSections: React.FC<CombinedSectionsProps> = ({ sections }) => {
  // أخذ آخر 4 أقسام
  const combinedSections = sections.slice(-4);

  return (
    <div className="p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">الأقسام المجمعة</h1>
          <Link
            to="/"
            className="text-white hover:underline inline-flex items-center"
          >
            <ArrowRight className="ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {combinedSections.map((section) => (
            <div
              key={section.id}
              className="border border-white/10 rounded-lg overflow-hidden backdrop-blur-md bg-white/5"
            >
              <div
                className="p-4 text-white font-bold text-center text-xl"
                style={{ backgroundColor: section.color }}
              >
                {section.title}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white/80">
                    عدد الطلاب: {section.students.filter(s => s).length}
                  </div>
                  <Link
                    to={`/section/${section.id}`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
                <ul className="space-y-2">
                  {section.students.map((student, index) => (
                    <li
                      key={`${section.id}-slot-${index}`}
                      className={`p-3 rounded-lg flex items-center ${
                        student
                          ? 'bg-white/10 backdrop-blur-sm'
                          : 'bg-white/5 border border-dashed border-white/20'
                      }`}
                    >
                      <span className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-full mr-3 text-white text-sm">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-white">
                        {student ? student.name : 'مقعد شاغر'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CombinedSections; 