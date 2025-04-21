import React, { useState } from 'react';
import { SectionType } from '../types';
import { ClipboardList, Pencil, Trash2, X, Check } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';

interface RegistrationFormProps {
  onAddStudent: (name: string, section: SectionType) => Promise<{
    success: boolean;
    message?: string;
  }>;
  className?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onAddStudent, className = '' }) => {
  const [name, setName] = useState('');
  const [section, setSection] = useState<SectionType>('elementary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { sections, deleteStudent } = useStudentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await onAddStudent(name.trim(), section);
      if (result.success) {
        setName('');
        setMessage('تم تسجيل الطالب بنجاح');
      } else {
        setMessage(result.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء التسجيل');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (sectionId: SectionType, position: number, newName: string) => {
    if (!newName.trim()) return;

    const currentSection = sections.find(s => s.id === sectionId);
    if (!currentSection) return;

    const student = currentSection.students[position - 1];
    if (!student) return;

    try {
      // تحديث الاسم في المخزن
      const updatedSections = sections.map(s => {
        if (s.id === sectionId) {
          const updatedStudents = [...s.students];
          if (updatedStudents[position - 1]) {
            updatedStudents[position - 1] = {
              ...updatedStudents[position - 1]!,
              name: newName.trim()
            };
          }
          return { ...s, students: updatedStudents };
        }
        return s;
      });

      localStorage.setItem('student-sections', JSON.stringify(updatedSections));
      setMessage('تم التعديل بنجاح');
      setEditingId(null);
      setEditName('');
    } catch (error) {
      setMessage('حدث خطأ أثناء التعديل');
    }
  };

  const handleDelete = async (studentId: string, sectionId: SectionType, position: number) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const result = await deleteStudent(studentId, sectionId, position);

      if (result.success) {
        setMessage('تم حذف الطالب بنجاح');
      } else {
        setMessage(result.message || 'حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء الحذف');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSectionName = (sectionId: string) => {
    const sections = {
      elementary: 'القسم الابتدائي',
      middle: 'القسم المتوسط',
      secondary: 'القسم الثانوي',
      universal: 'القسم العالمي'
    };
    return sections[sectionId as keyof typeof sections];
  };

  // تجميع كل الطلاب من جميع الأقسام
  const allStudents = sections.flatMap(section =>
    section.students
      .map((student, index) => student && {
        id: student.id,
        name: student.name,
        section: section.id,
        position: index + 1
      })
      .filter((student): student is NonNullable<typeof student> => student !== null)
  );

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-5">
          <ClipboardList className="h-8 w-8 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">شاشة التسجيل</h2>
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded-md text-center text-white ${
            message.includes('نجاح') ? 'bg-green-500' : 'bg-red-500'
          }`} role="alert">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم الطالب</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white/50"
              placeholder="أدخل اسم الطالب"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">القسم</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as SectionType)}
              className="w-full px-3 py-2 border rounded-lg bg-white/50"
              disabled={isSubmitting}
            >
              <option value="elementary">القسم الابتدائي</option>
              <option value="middle">القسم المتوسط</option>
              <option value="secondary">القسم الثانوي</option>
              <option value="universal">القسم العالمي</option>
            </select>
          </div>
          
          <button
            type="submit"
            className={`
              w-full px-4 py-2 text-white rounded-lg
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الطالب'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة الطلاب</h3>
        <div className="space-y-2">
          {allStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex-1">
                {editingId === student.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <div>
                    <span className="font-medium">{student.name}</span>
                    <span className="text-sm text-gray-500 mr-2">
                      ({getSectionName(student.section)} - {student.position})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editingId === student.id) {
                      handleEdit(student.section as SectionType, student.position, editName);
                    } else {
                      setEditingId(student.id);
                      setEditName(student.name);
                    }
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  disabled={isDeleting}
                >
                  {editingId === student.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Pencil className="h-5 w-5" />
                  )}
                </button>
                {editingId === student.id && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(student.id, student.section as SectionType, student.position)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;