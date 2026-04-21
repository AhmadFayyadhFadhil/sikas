import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  { text: "Halo", lang: "Indonesia" },
  { text: "Assalamu'alaikum", lang: "Arabic" },
  { text: "Sampurasun", lang: "Sunda" },
  { text: "Sugeng Rawuh", lang: "Jawa" },
  { text: "Welcome", lang: "English" },
  { text: "こんにちは", lang: "Japanese" },
];

export default function LoadingScreen({ onFinished }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('greetings'); // 'greetings' | 'logo' | 'exit'

  const finish = useCallback(() => {
    setPhase('exit');
    setTimeout(() => onFinished(), 600);
  }, [onFinished]);

  useEffect(() => {
    if (phase !== 'greetings') return;

    if (currentIndex >= greetings.length - 1) {
      // Last greeting shown, transition to logo phase
      const timer = setTimeout(() => setPhase('logo'), 600);
      return () => clearTimeout(timer);
    }

    // Speed: first greeting stays longer, then accelerates
    const delay = currentIndex === 0 ? 800 : 300;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, phase]);

  useEffect(() => {
    if (phase === 'logo') {
      const timer = setTimeout(finish, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, finish]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Ambient glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"
          />

          {/* Secondary ambient */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px] translate-x-32 translate-y-20"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Greetings Phase */}
            {phase === 'greetings' && (
              <div className="h-24 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={greetings[currentIndex].text}
                    initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, scale: 0.9, filter: 'blur(8px)' }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center"
                  >
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                      {greetings[currentIndex].text}
                    </h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 0.15 }}
                      className="mt-2 text-xs text-slate-400 uppercase tracking-[0.3em] font-medium"
                    >
                      {greetings[currentIndex].lang}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Logo Phase */}
            {phase === 'logo' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <span className="text-white font-black text-2xl">RT</span>
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-2xl font-bold text-white tracking-tight"
                >
                  SiKas RT
                </motion.h2>
              </motion.div>
            )}

            {/* Progress Dots */}
            {phase === 'greetings' && (
              <div className="mt-12 flex items-center gap-1.5">
                {greetings.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentIndex ? 32 : 8,
                      opacity: i === currentIndex ? 1 : i < currentIndex ? 0.5 : 0.15,
                      backgroundColor: i <= currentIndex ? '#3b82f6' : '#475569',
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-1.5 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
