import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useEffect } from 'react';

const LevelUpOverlay = ({ level, visible, onComplete }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      // 1. Physical Feedback
      Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
      
      // 2. Force close after 4 seconds no matter what
      timer = setTimeout(() => {
        console.log("Level up sequence complete. Closing overlay.");
        onComplete();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Add a manual click-to-close just in case the timer fails
          onClick={onComplete}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md cursor-pointer"
        >
          {/* Magic Circle */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute w-72 h-72 border-2 border-dashed border-cyan-500/20 rounded-full"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10"
          >
            <h1 className="text-6xl font-black italic text-white drop-shadow-[0_0_20px_rgba(0,238,255,0.6)]">
              LEVEL <span className="text-cyan-400">UP</span>
            </h1>
            <div className="mt-4 bg-white/10 py-2 px-10 border-y border-white/20">
              <span className="text-2xl font-bold">LV. {level}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 tracking-[0.3em] uppercase animate-pulse">
              Tap to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpOverlay;