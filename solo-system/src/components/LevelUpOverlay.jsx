import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useHunterStore } from '../store/useHunterStore';

const LevelUpOverlay = ({ level, visible, onComplete }) => {
  const isAwakened = useHunterStore((state) => state.isAwakened);

  useEffect(() => {
    let timer;
    if (visible) {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
      }
      
      // Extended slightly to 5s to appreciate the new animations
      timer = setTimeout(() => {
        onComplete();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  const accentColor = isAwakened ? "text-purple-500" : "text-cyan-400";
  const glowColor = isAwakened ? "drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]" : "drop-shadow-[0_0_25px_rgba(0,212,255,0.8)]";
  const borderColor = isAwakened ? "border-purple-500/30" : "border-cyan-500/30";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "brightness(2) blur(20px)" }}
          onClick={onComplete}
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/98 backdrop-blur-xl cursor-pointer overflow-hidden"
        >
          {/* --- LAYER 1: THE GREAT MANDALA --- */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className={`absolute w-[500px] h-[500px] border border-dashed ${borderColor} rounded-full opacity-20`}
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className={`absolute w-96 h-96 border-2 border-double ${borderColor} rounded-full opacity-40`}
          />

          {/* --- LAYER 2: RADIANT BURST --- */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className={`absolute w-64 h-64 rounded-full ${isAwakened ? 'bg-purple-500' : 'bg-cyan-500'} blur-3xl`}
          />

          {/* --- MAIN CONTENT --- */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="text-center z-10"
          >
            <motion.div
               animate={{ opacity: [1, 0.8, 1], scale: [1, 1.05, 1] }}
               transition={{ duration: 0.2, repeat: 5 }}
            >
              <h1 className={`text-7xl font-black italic text-white leading-none tracking-tighter ${glowColor}`}>
                LEVEL <span className={accentColor}>UP</span>
              </h1>
            </motion.div>

            <div className="mt-6 relative inline-block">
              {/* Decorative brackets */}
              <div className={`absolute -left-4 top-0 bottom-0 w-1 border-l-2 border-y-2 ${borderColor}`} />
              <div className={`absolute -right-4 top-0 bottom-0 w-1 border-r-2 border-y-2 ${borderColor}`} />
              
              <div className="bg-white/5 py-3 px-12 backdrop-blur-md">
                <span className="text-3xl font-black italic tracking-widest text-white">
                  STATUS: <span className={accentColor}>LV. {level}</span>
                </span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 space-y-1"
            >
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em]">
                Dimensional constraints released
              </p>
              <p className={`${accentColor} text-[8px] font-bold uppercase tracking-[0.8em] animate-pulse`}>
                Authority Upgraded
              </p>
            </motion.div>
          </motion.div>

          {/* --- LAYER 3: SCANLINE & PARTICLES --- */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
            />
          </div>

          <p className="absolute bottom-10 text-[8px] text-gray-600 uppercase tracking-[0.4em] font-black italic opacity-40">
            Tap to resume the hunt
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpOverlay;