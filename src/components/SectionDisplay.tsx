import React from 'react';
import { SectionData } from '../types';

interface SectionDisplayProps {
  sections: SectionData[];
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({ sections }) => {
  return (
    <div className="rounded-lg overflow-hidden" dir="rtl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center"> </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className="border border-white/10 rounded-lg overflow-hidden backdrop-blur-md bg-white/5"
          >
            <div 
              className="p-3 text-white font-bold text-center"
              style={{ backgroundColor: section.color }}
            >
              {section.title}
            </div>
            
            <div className="p-3">
              <ul className="space-y-2 min-h-[450px]">
                {section.students.map((student, index) => (
                  <li 
                    key={`${section.id}-slot-${index}`}
                    className={`p-2 rounded-md flex items-center ${
                      student ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/5 border border-dashed border-white/20'
                    } transition-all duration-300 hover:shadow-sm`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full mr-2 text-white text-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-white">
                      {student ? student.name : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionDisplay