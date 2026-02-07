import { useEffect, useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';
import { motion, AnimatePresence } from 'framer-motion';
import { systemSounds } from '../utils/sounds';

export default function RestMode() {
  const { isResting, wakeUp, restStartTime, isAwakened } = useHunterStore();
  const [elapsed, setElapsed] = useState("00:00:00");

  // Calculate time spent resting
  useEffect(() => {
    if (!isResting || !restStartTime) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - restStartTime) / 1000);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setElapsed(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restStartTime]);

  if (!isResting) return null;

  const accentColor = isAwakened ? "text-purple-500" : "text-cyan-400";
  const glowColor = isAwakened ? "rgba(168, 85, 247, 0.4)" : "rgba(34, 211, 238, 0.4)";
  const circleBorder = isAwakened ? "border-purple-600/30" : "border-cyan-600/30";

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-[#000000] flex flex-col items-center justify-center p-8 font-system overflow-hidden"
    >
      {/* Floating Mana Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", x: Math.random() * 100 + "vw", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              delay: Math.random() * 20 
            }}
            className={`absolute w-1 h-1 rounded-full ${isAwakened ? 'bg-purple-500' : 'bg-cyan-400'}`}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Rings */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className={`absolute w-80 h-80 border rounded-full ${circleBorder}`}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className={`absolute w-64 h-64 border rounded-full ${circleBorder} shadow-[0_0_60px_${glowColor}]`}
        />

        {/* Central Info Node */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-2"
          >
            <h2 className={`${accentColor} text-[10px] font-black tracking-[0.6em] uppercase italic`}>
              {isAwakened ? "Monarch's Meditation" : "System Recovery"}
            </h2>
          </motion.div>
          
          <p className="text-5xl font-black text-white italic tracking-tighter mb-4 font-mono">
            {elapsed}
          </p>
          
          <div className="flex items-center gap-3">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
             <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">
               Status: Synthesizing Mana
             </span>
          </div>
        </div>
      </div>

      {/* Recovery Details */}
      <div className="mt-20 text-center max-w-xs relative z-10">
        <div className="grid grid-cols-2 gap-8 mb-16">
          <div className="text-left border-l border-white/10 pl-4">
            <p className="text-[7px] text-gray-600 uppercase font-black mb-1">Fatigue Level</p>
            <p className="text-xs text-white font-bold italic">REDUCING...</p>
          </div>
          <div className="text-left border-l border-white/10 pl-4">
            <p className="text-[7px] text-gray-600 uppercase font-black mb-1">Mana Flow</p>
            <p className={`text-xs ${accentColor} font-bold italic`}>STABLE</p>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            systemSounds.click();
            wakeUp();
          }}
          className={`group relative px-12 py-4 overflow-hidden transition-all`}
        >
          {/* Button Background Animation */}
          <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${isAwakened ? 'bg-purple-500' : 'bg-cyan-400'}`} />
          <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isAwakened ? 'bg-purple-500' : 'bg-cyan-400'}`} />
          
          <span className="relative z-10 text-white text-[10px] font-black tracking-[0.4em] uppercase group-hover:tracking-[0.6em] transition-all">
            Wake Up [Initialize]
          </span>
        </motion.button>
        
        <p className="mt-8 text-[7px] text-gray-700 uppercase tracking-widest opacity-50">
          The Monarch never sleeps, he only waits.
        </p>
      </div>
    </motion.div>
  );
}