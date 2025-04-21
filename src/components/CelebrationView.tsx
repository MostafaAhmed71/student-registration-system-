import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../types';
import confetti from 'canvas-confetti';

interface CelebrationStudent extends Student {
  number: number;
}

interface CelebrationViewProps {
  students: CelebrationStudent[];
  onComplete: () => void;
  sectionColor: string;
}

const CelebrationView: React.FC<CelebrationViewProps> = ({
  students,
  onComplete,
  sectionColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState<'announcement' | 'name'>('announcement');

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
                setTimeout(onComplete, 2000);
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
  }, [currentIndex, phase, students.length, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <AnimatePresence mode="wait">
        {currentIndex >= 0 && currentIndex < students.length && (
          phase === 'announcement' ? (
            <motion.div
              key="announcement"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: 1,
              }}
              exit={{ 
                scale: 2,
                opacity: 0,
              }}
              transition={{
                duration: 1,
                times: [0, 0.5, 1],
              }}
              className="text-center"
            >
              <div 
                className="text-6xl font-bold mb-6"
                style={{ 
                  color: sectionColor,
                  textShadow: `
                    0 0 20px ${sectionColor},
                    0 0 40px ${sectionColor}
                  `,
                }}
              >
                المتأهل
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-9xl font-bold"
                style={{ 
                  color: 'white',
                  textShadow: `
                    0 0 30px ${sectionColor},
                    0 0 60px ${sectionColor}
                  `,
                }}
              >
                {students[currentIndex].number}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="name"
              className="relative bg-black/30 px-20 py-10 rounded-2xl backdrop-blur-sm"
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              exit={{ 
                scale: 1.5,
                opacity: 0,
                y: -100,
                transition: { duration: 1.2, ease: "easeOut" }
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <div 
                  className="text-8xl font-bold text-center"
                  style={{ 
                    color: 'white',
                    textShadow: `
                      0 0 30px ${sectionColor},
                      0 0 60px ${sectionColor},
                      0 0 90px ${sectionColor}
                    `,
                  }}
                >
                  {students[currentIndex].name}
                </div>
              </motion.div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationView; 