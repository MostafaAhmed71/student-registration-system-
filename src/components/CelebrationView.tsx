import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../types';
import confetti from 'canvas-confetti';
import { useSectionContext } from '../context/SectionContext';

interface CelebrationStudent extends Student {
  number: number;
}

interface CelebrationViewProps {
  students: CelebrationStudent[];
  sectionColor: string;
}

const CelebrationView: React.FC<CelebrationViewProps> = ({
  students,
  sectionColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState<'announcement' | 'name'>('announcement');
  const { endCelebration } = useSectionContext();

  const launchConfetti = () => {
    const defaults = {
      colors: [sectionColor, '#ffffff', '#FFD700', '#FFA500'],
      gravity: 0.7,
      ticks: 300,
    };

    // إطلاق من الجانب الأيسر السفلي
    function fireLeft() {
      confetti({
        ...defaults,
        particleCount: 100,
        angle: 45,
        spread: 40,
        origin: { x: 0, y: 0.9 },
        startVelocity: 50,
      });
    }

    // إطلاق من الجانب الأيمن السفلي
    function fireRight() {
      confetti({
        ...defaults,
        particleCount: 100,
        angle: 135,
        spread: 40,
        origin: { x: 1, y: 0.9 },
        startVelocity: 50,
      });
    }

    // إطلاق من الأعلى على الجوانب
    function fireTop() {
      // الجانب الأيسر العلوي
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 80,
        spread: 30,
        origin: { x: 0.1, y: 0.1 },
        startVelocity: 30,
        gravity: 1,
      });

      // الجانب الأيمن العلوي
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 100,
        spread: 30,
        origin: { x: 0.9, y: 0.1 },
        startVelocity: 30,
        gravity: 1,
      });
    }

    // إطلاق متتابع من كل الاتجاهات
    const delays = [0, 700, 1400, 2100];
    delays.forEach((delay) => {
      setTimeout(() => {
        fireLeft();
        fireRight();
      }, delay);
    });

    // إطلاق من الأعلى بتوقيت مختلف
    const topDelays = [300, 1000, 1700];
    topDelays.forEach((delay) => {
      setTimeout(fireTop, delay);
    });

    // المطر الذهبي من الجوانب العلوية
    function goldRain() {
      // الجانب الأيسر
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 30,
        origin: { x: 0.1, y: 0.15 },
        colors: ['gold', '#FFD700'],
        gravity: 0.8,
        scalar: 1.2,
        ticks: 200,
        startVelocity: 40,
      });
      
      // الجانب الأيمن
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 30,
        origin: { x: 0.9, y: 0.15 },
        colors: ['gold', '#FFD700'],
        gravity: 0.8,
        scalar: 1.2,
        ticks: 200,
        startVelocity: 40,
      });
    }

    // إطلاق المطر الذهبي بشكل متتابع
    [500, 1500, 2500].forEach(delay => {
      setTimeout(goldRain, delay);
    });
  };

  useEffect(() => {
    if (currentIndex === -1) {
      setTimeout(() => {
        setCurrentIndex(0);
        setPhase('announcement');
      }, 1000);
    } else if (currentIndex < students.length) {
      if (phase === 'announcement') {
        const timer = setTimeout(() => {
          setPhase('name');
          launchConfetti();
          // إطلاق متكرر للألعاب النارية
          const intervals = [3000, 6000];
          intervals.forEach(delay => {
            setTimeout(launchConfetti, delay);
          });
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          if (currentIndex === students.length - 1) {
            // احتفال نهائي مكثف
            launchConfetti();
            setTimeout(() => {
              launchConfetti();
              setTimeout(() => {
                launchConfetti();
                setTimeout(endCelebration, 2000);
              }, 1500);
            }, 1500);
          } else {
            setCurrentIndex(currentIndex + 1);
            setPhase('announcement');
          }
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, phase, students.length, endCelebration]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Background.jpg')",
          filter: 'brightness(0.3) blur(4px)'
        }}
      />
      
      <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
        {/* Side decorative bars */}
        <motion.div
          className="absolute left-0 h-full w-4"
          style={{ backgroundColor: sectionColor }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute right-0 h-full w-4"
          style={{ backgroundColor: sectionColor }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence mode="wait">
          {currentIndex >= 0 && currentIndex < students.length && (
            <motion.div
              key={`${currentIndex}-${phase}`}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {phase === 'announcement' ? (
                <div className="text-4xl font-bold text-white mb-4">
                  {students[currentIndex].number === 1 ? (
                    <span>🏆 المركز الأول 🏆</span>
                  ) : students[currentIndex].number === 2 ? (
                    <span>🥈 المركز الثاني 🥈</span>
                  ) : students[currentIndex].number === 3 ? (
                    <span>🥉 المركز الثالث 🥉</span>
                  ) : (
                    <span>المركز {students[currentIndex].number}</span>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.h2
                    className="text-6xl font-bold"
                    style={{ color: sectionColor }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {students[currentIndex].name}
                  </motion.h2>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {students.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: index === currentIndex ? sectionColor : 'white',
                opacity: index === currentIndex ? 1 : 0.5
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CelebrationView; 