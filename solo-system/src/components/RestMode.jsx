import { useHunterStore } from '../store/useHunterStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestMode() {
  const { isResting, wakeUp, restStartTime } = useHunterStore();

  if (!isResting) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 font-system"
    >
      <div className="relative">
        {/* Pulsing Mana Circle */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-48 h-48 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,212,255,0.2)]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-blue-400 text-[10px] font-black tracking-[0.4em] mb-1 uppercase">Mana Recharge</h2>
          <p className="text-white text-xs font-bold animate-pulse">RESTING...</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-10 max-w-[300px]">
          Physical and spiritual energy is being restored. All system notifications muted.
        </p>

        <button 
          onClick={wakeUp}
          className="px-10 py-3 border border-blue-900 text-blue-900 text-[10px] font-black tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all uppercase"
        >
          Wake Up [Initialize]
        </button>
      </div>
    </motion.div>
  );
}