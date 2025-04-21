import React from 'react';
import { Link } from 'react-router-dom';
import { SectionData } from '../types';
import { Users, ArrowRight } from 'lucide-react';

interface AllSectionsProps {
  sections: SectionData[];
}

const AllSections: React.FC<AllSectionsProps> = ({ sections }) => {
  // تقسيم الأقسام إلى مجموعتين: الأقسام العادية والأقسام المجمعة
  const regularSections = sections.slice(0, -4);
  const combinedSections = sections.slice(-4);

  return (
    <div className="min-h-screen flex items-center" dir="rtl">
      <div className="w-full p-8">
        {/* الأقسام العادية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {regularSections.map((section) => (
            <Link
              to={`/section/${section.id}`}
              key={section.id}
              className="group block rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className="p-6 text-white font-bold text-center text-2xl relative"
                style={{ backgroundColor: section.color }}
              >
                <div className="relative z-10 drop-shadow-lg">{section.title}</div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
              </div>
              <div className="p-6 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-white ml-3" />
                  <div>
                    <div className="text-white font-bold text-lg">
                      {section.students.filter(s => s).length} طالب
                    </div>
                    <div className="text-white/90">
                      {section.students.filter(s => !s).length} مقعد متاح
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-white/90 group-hover:text-white flex items-center justify-center transition-colors">
                  <span className="font-medium">عرض التفاصيل</span>
                  <ArrowRight className="w-5 h-5 mr-2 transition-transform duration-300 transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* الأقسام المجمعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {combinedSections.map((section) => (
            <Link
              to={`/section/${section.id}`}
              key={section.id}
              className="group block rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className="p-4 text-white font-bold text-xl relative"
                style={{ backgroundColor: section.color }}
              >
                <div className="relative z-10 drop-shadow">{section.title}</div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
              </div>
              <div className="p-4 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur">
                <div className="flex items-center space-x-3 space-x-reverse mb-2">
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    {section.students.filter(s => s).length} طالب
                  </span>
                </div>
                <div className="text-white/80 text-sm mb-3">
                  {section.students.filter(s => !s).length} مقعد متاح
                </div>
                <div className="text-white/90 group-hover:text-white text-sm flex items-center justify-end transition-colors">
                  <span>عرض التفاصيل</span>
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSections; 